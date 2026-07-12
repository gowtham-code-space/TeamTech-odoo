const { pool } = require('../config/db');

/**
 * Helper to log asset history.
 */
const logAssetHistory = async (assetId, action, oldValue, newValue, userId, remarks) => {
  try {
    await pool.query(
      `INSERT INTO asset_history (asset_id, action, old_value, new_value, changed_by, remarks) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        assetId,
        action,
        oldValue ? JSON.stringify(oldValue) : null,
        newValue ? JSON.stringify(newValue) : null,
        userId || null,
        remarks || null
      ]
    );
  } catch (err) {
    console.error('Failed to log asset history:', err.message);
  }
};

/**
 * Automatically check and mark overdue allocations.
 */
const detectAndMarkOverdue = async () => {
  try {
    const [result] = await pool.query(
      `UPDATE asset_allocations 
       SET status_lookup_id = 15 
       WHERE status_lookup_id = 13 AND expected_return_date < CURDATE() AND actual_return_date IS NULL`
    );
    return result.affectedRows;
  } catch (err) {
    console.error('Failed to run overdue allocations detector:', err.message);
    return 0;
  }
};

/**
 * Allocate an asset.
 */
const allocateAsset = async (assetId, userId, expectedReturnDate, allocatedBy) => {
  // Overdue check trigger before performing allocation
  await detectAndMarkOverdue();

  const [assetRows] = await pool.query(
    'SELECT asset_id, status_lookup_id, asset_name FROM assets WHERE asset_id = ?',
    [assetId]
  );

  if (assetRows.length === 0) {
    throw new Error('Target asset record not found.');
  }

  const asset = assetRows[0];
  // 1 = Available, 2 = Allocated, 3 = Reserved, 4 = Under Maintenance
  if (parseInt(asset.status_lookup_id) !== 1) {
    throw new Error(`Asset is not available for allocation. Current Status: ${asset.status_lookup_id}`);
  }

  // Prevent double active allocation entries
  const [activeAlloc] = await pool.query(
    'SELECT allocation_id FROM asset_allocations WHERE asset_id = ? AND status_lookup_id IN (13, 15)',
    [assetId]
  );
  if (activeAlloc.length > 0) {
    throw new Error('This asset is already tied to an active allocation.');
  }

  // Create allocation entry (13 = Active status)
  const [allocResult] = await pool.query(
    `INSERT INTO asset_allocations (asset_id, user_id, allocated_by, expected_return_date, status_lookup_id) 
     VALUES (?, ?, ?, ?, 13)`,
    [assetId, userId, allocatedBy || null, expectedReturnDate || null]
  );

  // Update asset status to 2 (Allocated)
  await pool.query('UPDATE assets SET status_lookup_id = 2 WHERE asset_id = ?', [assetId]);

  // Log in history
  await logAssetHistory(
    assetId,
    'ALLOCATE',
    { status_lookup_id: 1 },
    { status_lookup_id: 2, allocation_id: allocResult.insertId },
    allocatedBy,
    `Asset allocated to User ID: ${userId}`
  );

  // Push notification record
  await pool.query(
    'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
    [userId, 'Asset Allocated', `Asset "${asset.asset_name}" has been allocated to you.`]
  );

  return { allocation_id: allocResult.insertId };
};

/**
 * Return an allocated asset.
 */
const returnAsset = async (allocationId, conditionLookupId, notes, approvedBy) => {
  const [allocRows] = await pool.query(
    `SELECT a.*, u.full_name AS user_name, ast.asset_name 
     FROM asset_allocations a
     JOIN users u ON a.user_id = u.id
     JOIN assets ast ON a.asset_id = ast.asset_id
     WHERE a.allocation_id = ?`,
    [allocationId]
  );

  if (allocRows.length === 0) {
    throw new Error('Allocation record not found.');
  }

  const alloc = allocRows[0];
  // 14 = Returned
  if (parseInt(alloc.status_lookup_id) === 14) {
    throw new Error('This asset allocation has already been marked as returned.');
  }

  // Update allocation record
  await pool.query(
    'UPDATE asset_allocations SET status_lookup_id = 14, actual_return_date = CURDATE() WHERE allocation_id = ?',
    [allocationId]
  );

  // Log return condition in asset_returns (Default condition 9 = Good if not specified)
  const condId = conditionLookupId || 9;
  await pool.query(
    'INSERT INTO asset_returns (allocation_id, approved_by, condition_lookup_id, notes) VALUES (?, ?, ?, ?)',
    [allocationId, approvedBy || null, condId, notes ? notes.trim() : null]
  );

  // Set asset status to 1 (Available) and update condition
  await pool.query(
    'UPDATE assets SET status_lookup_id = 1, condition_lookup_id = ? WHERE asset_id = ?',
    [condId, alloc.asset_id]
  );

  // Log history
  await logAssetHistory(
    alloc.asset_id,
    'RETURN',
    { status_lookup_id: 2 },
    { status_lookup_id: 1, condition_lookup_id: condId },
    approvedBy,
    `Asset returned by User ID: ${alloc.user_id}. Condition: ${condId}`
  );

  // Push notification record
  await pool.query(
    'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
    [alloc.user_id, 'Asset Returned Successfully', `Asset "${alloc.asset_name}" return confirmation registered.`]
  );

  return { allocation_id: allocationId };
};

/**
 * Raise a transfer request.
 */
const requestTransfer = async (assetId, fromUserId, toUserId, reason) => {
  const [asset] = await pool.query('SELECT asset_name FROM assets WHERE asset_id = ?', [assetId]);
  if (asset.length === 0) {
    throw new Error('Asset not found.');
  }

  // Create transfer entry (16 = Requested status)
  const [result] = await pool.query(
    `INSERT INTO asset_transfers (asset_id, from_user_id, to_user_id, status_lookup_id, reason) 
     VALUES (?, ?, ?, 16, ?)`,
    [assetId, fromUserId, toUserId, reason ? reason.trim() : null]
  );

  return { transfer_id: result.insertId };
};

/**
 * Approve an asset transfer.
 */
const approveTransfer = async (transferId, approvedBy) => {
  const [transferRows] = await pool.query(
    'SELECT t.*, ast.asset_name FROM asset_transfers t JOIN assets ast ON t.asset_id = ast.asset_id WHERE t.transfer_id = ?',
    [transferId]
  );

  if (transferRows.length === 0) {
    throw new Error('Transfer request not found.');
  }

  const transfer = transferRows[0];
  if (parseInt(transfer.status_lookup_id) !== 16) {
    throw new Error('This transfer request has already been processed.');
  }

  // Close the old active allocation for from_user_id (status 14 = Returned)
  await pool.query(
    `UPDATE asset_allocations 
     SET status_lookup_id = 14, actual_return_date = CURDATE() 
     WHERE asset_id = ? AND user_id = ? AND status_lookup_id IN (13, 15)`,
    [transfer.asset_id, transfer.from_user_id]
  );

  // Create a new active allocation for to_user_id (status 13 = Active)
  // expectedReturnDate is set to 30 days from now as default
  const expectedReturn = new Date();
  expectedReturn.setDate(expectedReturn.getDate() + 30);

  const [allocResult] = await pool.query(
    `INSERT INTO asset_allocations (asset_id, user_id, allocated_by, expected_return_date, status_lookup_id) 
     VALUES (?, ?, ?, ?, 13)`,
    [transfer.asset_id, transfer.to_user_id, approvedBy, expectedReturn]
  );

  // Update transfer request status to 19 (Completed)
  await pool.query(
    'UPDATE asset_transfers SET status_lookup_id = 19, approved_by = ? WHERE transfer_id = ?',
    [approvedBy, transferId]
  );

  // Log in asset history
  await logAssetHistory(
    transfer.asset_id,
    'TRANSFER_APPROVE',
    { user_id: transfer.from_user_id },
    { user_id: transfer.to_user_id, allocation_id: allocResult.insertId },
    approvedBy,
    `Asset transfer approved. Shifted from user ${transfer.from_user_id} to ${transfer.to_user_id}`
  );

  // Send notifications
  await pool.query(
    'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
    [transfer.to_user_id, 'Asset Transferred to You', `Asset "${transfer.asset_name}" has been transferred to you.`]
  );
  await pool.query(
    'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
    [transfer.from_user_id, 'Asset Transfer Completed', `Asset "${transfer.asset_name}" has been transferred out.`]
  );

  return { transfer_id: transferId };
};

/**
 * Reject a transfer request.
 */
const rejectTransfer = async (transferId, approvedBy) => {
  const [transferRows] = await pool.query(
    'SELECT * FROM asset_transfers WHERE transfer_id = ?',
    [transferId]
  );

  if (transferRows.length === 0) {
    throw new Error('Transfer request not found.');
  }

  const transfer = transferRows[0];
  if (parseInt(transfer.status_lookup_id) !== 16) {
    throw new Error('This transfer request has already been processed.');
  }

  // Update transfer status to 18 (Rejected)
  await pool.query(
    'UPDATE asset_transfers SET status_lookup_id = 18, approved_by = ? WHERE transfer_id = ?',
    [approvedBy, transferId]
  );

  return { transfer_id: transferId };
};

/**
 * List allocations with advanced filters.
 */
const listAllocations = async (filters = {}) => {
  const { userId, assetId, statusId } = filters;

  let query = `
    SELECT 
      a.*,
      ast.asset_name,
      ast.asset_tag,
      u.full_name AS employee_name,
      u.email AS employee_email,
      s.lookup_value AS allocation_status
    FROM asset_allocations a
    JOIN assets ast ON a.asset_id = ast.asset_id
    JOIN users u ON a.user_id = u.id
    JOIN lookup_values s ON a.status_lookup_id = s.lookup_id
    WHERE 1=1
  `;
  const params = [];

  if (userId) {
    query += ' AND a.user_id = ?';
    params.push(userId);
  }

  if (assetId) {
    query += ' AND a.asset_id = ?';
    params.push(assetId);
  }

  if (statusId) {
    query += ' AND a.status_lookup_id = ?';
    params.push(statusId);
  }

  query += ' ORDER BY a.created_at DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * List all transfer requests.
 */
const listTransfers = async () => {
  const query = `
    SELECT 
      t.*,
      ast.asset_name,
      ast.asset_tag,
      uFrom.full_name AS from_employee_name,
      uTo.full_name AS to_employee_name,
      s.lookup_value AS transfer_status
    FROM asset_transfers t
    JOIN assets ast ON t.asset_id = ast.asset_id
    JOIN users uFrom ON t.from_user_id = uFrom.id
    JOIN users uTo ON t.to_user_id = uTo.id
    JOIN lookup_values s ON t.status_lookup_id = s.lookup_id
    ORDER BY t.created_at DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

module.exports = {
  detectAndMarkOverdue,
  allocateAsset,
  returnAsset,
  requestTransfer,
  approveTransfer,
  rejectTransfer,
  listAllocations,
  listTransfers
};
