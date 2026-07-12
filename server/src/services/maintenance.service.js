const { pool } = require('../config/db');

/**
 * Log updates to the maintenance workflow.
 */
const logMaintenanceUpdate = async (maintenanceId, statusId, userId, comments) => {
  try {
    await pool.query(
      `INSERT INTO maintenance_updates (maintenance_id, updated_by, status_lookup_id, comments) 
       VALUES (?, ?, ?, ?)`,
      [maintenanceId, userId, statusId, comments ? comments.trim() : null]
    );
  } catch (err) {
    console.error('Failed to log maintenance updates history:', err.message);
  }
};

/**
 * Raise a new maintenance request.
 */
const raiseRequest = async (assetId, issueDescription, priorityId, userId) => {
  const [asset] = await pool.query('SELECT asset_name FROM assets WHERE asset_id = ?', [assetId]);
  if (asset.length === 0) {
    throw new Error('Asset record not found.');
  }

  // 24 = Pending status
  const [result] = await pool.query(
    `INSERT INTO maintenance_requests (asset_id, requested_by, priority_lookup_id, status_lookup_id, issue_description) 
     VALUES (?, ?, ?, 24, ?)`,
    [assetId, userId, priorityId, issueDescription.trim()]
  );

  const newMaintId = result.insertId;

  // Set asset status to 4 (Under Maintenance)
  await pool.query('UPDATE assets SET status_lookup_id = 4 WHERE asset_id = ?', [assetId]);

  // Log update
  await logMaintenanceUpdate(newMaintId, 24, userId, 'Maintenance request submitted.');

  return { maintenance_id: newMaintId };
};

/**
 * Approve a maintenance request.
 */
const approveRequest = async (maintenanceId, userId) => {
  const [maint] = await pool.query('SELECT * FROM maintenance_requests WHERE maintenance_id = ?', [maintenanceId]);
  if (maint.length === 0) {
    throw new Error('Maintenance request not found.');
  }

  // 25 = Approved status
  await pool.query(
    'UPDATE maintenance_requests SET status_lookup_id = 25, approved_by = ? WHERE maintenance_id = ?',
    [userId, maintenanceId]
  );

  await logMaintenanceUpdate(maintenanceId, 25, userId, 'Request approved.');

  return { maintenance_id: maintenanceId };
};

/**
 * Reject a maintenance request.
 */
const rejectRequest = async (maintenanceId, comments, userId) => {
  const [maintRows] = await pool.query('SELECT * FROM maintenance_requests WHERE maintenance_id = ?', [maintenanceId]);
  if (maintRows.length === 0) {
    throw new Error('Maintenance request not found.');
  }

  const maint = maintRows[0];

  // 26 = Rejected status
  await pool.query(
    'UPDATE maintenance_requests SET status_lookup_id = 26, approved_by = ? WHERE maintenance_id = ?',
    [userId, maintenanceId]
  );

  // Revert asset status back to 1 (Available)
  await pool.query('UPDATE assets SET status_lookup_id = 1 WHERE asset_id = ?', [maint.asset_id]);

  await logMaintenanceUpdate(maintenanceId, 26, userId, comments || 'Request rejected.');

  return { maintenance_id: maintenanceId };
};

/**
 * Assign technician to approved request.
 */
const assignTechnician = async (maintenanceId, technicianName, userId) => {
  const [maint] = await pool.query('SELECT * FROM maintenance_requests WHERE maintenance_id = ?', [maintenanceId]);
  if (maint.length === 0) {
    throw new Error('Maintenance request not found.');
  }

  // 27 = Technician Assigned status
  await pool.query(
    'UPDATE maintenance_requests SET status_lookup_id = 27 WHERE maintenance_id = ?',
    [maintenanceId]
  );

  await logMaintenanceUpdate(maintenanceId, 27, userId, `Technician assigned: ${technicianName.trim()}`);

  return { maintenance_id: maintenanceId };
};

/**
 * Start repair work.
 */
const startWork = async (maintenanceId, userId) => {
  const [maint] = await pool.query('SELECT * FROM maintenance_requests WHERE maintenance_id = ?', [maintenanceId]);
  if (maint.length === 0) {
    throw new Error('Maintenance request not found.');
  }

  // 28 = In Progress status
  await pool.query(
    'UPDATE maintenance_requests SET status_lookup_id = 28 WHERE maintenance_id = ?',
    [maintenanceId]
  );

  await logMaintenanceUpdate(maintenanceId, 28, userId, 'Repair work started.');

  return { maintenance_id: maintenanceId };
};

/**
 * Resolve maintenance task.
 */
const resolveWork = async (maintenanceId, comments, userId) => {
  const [maintRows] = await pool.query('SELECT * FROM maintenance_requests WHERE maintenance_id = ?', [maintenanceId]);
  if (maintRows.length === 0) {
    throw new Error('Maintenance request not found.');
  }

  const maint = maintRows[0];

  // 29 = Resolved status
  await pool.query(
    'UPDATE maintenance_requests SET status_lookup_id = 29 WHERE maintenance_id = ?',
    [maintenanceId]
  );

  // Restore asset status back to 1 (Available)
  await pool.query('UPDATE assets SET status_lookup_id = 1 WHERE asset_id = ?', [maint.asset_id]);

  await logMaintenanceUpdate(maintenanceId, 29, userId, comments || 'Maintenance issues resolved.');

  return { maintenance_id: maintenanceId };
};

/**
 * List maintenance requests.
 */
const listRequests = async (filters = {}) => {
  const { userId, assetId, statusId } = filters;

  let query = `
    SELECT 
      m.*,
      ast.asset_name,
      ast.asset_tag,
      uReq.full_name AS requester_name,
      uApp.full_name AS approver_name,
      p.lookup_value AS priority,
      s.lookup_value AS maintenance_status
    FROM maintenance_requests m
    JOIN assets ast ON m.asset_id = ast.asset_id
    JOIN users uReq ON m.requested_by = uReq.id
    LEFT JOIN users uApp ON m.approved_by = uApp.id
    JOIN lookup_values p ON m.priority_lookup_id = p.lookup_id
    JOIN lookup_values s ON m.status_lookup_id = s.lookup_id
    WHERE 1=1
  `;
  const params = [];

  if (userId) {
    query += ' AND m.requested_by = ?';
    params.push(userId);
  }

  if (assetId) {
    query += ' AND m.asset_id = ?';
    params.push(assetId);
  }

  if (statusId) {
    query += ' AND m.status_lookup_id = ?';
    params.push(statusId);
  }

  query += ' ORDER BY m.created_at DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Fetch maintenance updates timeline.
 */
const getRequestHistory = async (maintenanceId) => {
  const query = `
    SELECT mu.*, u.full_name AS updated_by_name, s.lookup_value AS status_text
    FROM maintenance_updates mu
    JOIN users u ON mu.updated_by = u.id
    JOIN lookup_values s ON mu.status_lookup_id = s.lookup_id
    WHERE mu.maintenance_id = ?
    ORDER BY mu.updated_at ASC
  `;
  const [rows] = await pool.query(query, [maintenanceId]);
  return rows;
};

module.exports = {
  raiseRequest,
  approveRequest,
  rejectRequest,
  assignTechnician,
  startWork,
  resolveWork,
  listRequests,
  getRequestHistory
};
