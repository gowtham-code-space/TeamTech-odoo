const { pool } = require('../config/db');

/**
 * Log changes to asset history.
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
 * Fetch asset by tag or QR code.
 */
const getAssetByQRCodeOrTag = async (codeOrTag) => {
  const query = `
    SELECT 
      a.*,
      c.category_name,
      d.department_name,
      l.location_name,
      s.lookup_value AS status,
      cond.lookup_value AS asset_condition
    FROM assets a
    JOIN asset_categories c ON a.category_id = c.category_id
    LEFT JOIN departments d ON a.department_id = d.department_id
    LEFT JOIN locations l ON a.location_id = l.location_id
    JOIN lookup_values s ON a.status_lookup_id = s.lookup_id
    JOIN lookup_values cond ON a.condition_lookup_id = cond.lookup_id
    WHERE a.qr_code = ? OR a.asset_tag = ?
  `;
  const [rows] = await pool.query(query, [codeOrTag, codeOrTag]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Create a new asset.
 */
const createAsset = async (data, userId) => {
  const {
    category_id,
    department_id,
    location_id,
    status_lookup_id = 1, // Default 'Available'
    condition_lookup_id = 8, // Default 'Excellent'
    asset_tag,
    asset_name,
    serial_number,
    manufacturer,
    model,
    acquisition_date,
    acquisition_cost,
    warranty_expiry,
    qr_code,
    is_bookable = 0,
    notes
  } = data;

  const [result] = await pool.query(
    `INSERT INTO assets (
      category_id, department_id, location_id, status_lookup_id, condition_lookup_id, 
      created_by, asset_tag, asset_name, serial_number, manufacturer, model, 
      acquisition_date, acquisition_cost, warranty_expiry, qr_code, is_bookable, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      category_id,
      department_id || null,
      location_id || null,
      status_lookup_id,
      condition_lookup_id,
      userId || null,
      asset_tag.trim(),
      asset_name.trim(),
      serial_number ? serial_number.trim() : null,
      manufacturer ? manufacturer.trim() : null,
      model ? model.trim() : null,
      acquisition_date || null,
      acquisition_cost || null,
      warranty_expiry || null,
      qr_code ? qr_code.trim() : null,
      is_bookable ? 1 : 0,
      notes ? notes.trim() : null
    ]
  );

  const newAssetId = result.insertId;

  // Log creation in history
  await logAssetHistory(newAssetId, 'CREATE', null, data, userId, 'Asset created in the inventory.');

  // If is_bookable is active, register it as a resource automatically
  if (is_bookable) {
    await pool.query(
      `INSERT INTO resources (asset_id, resource_name, booking_type, is_active) VALUES (?, ?, ?, 1)`,
      [newAssetId, asset_name.trim(), 'Equipment']
    );
  }

  return { asset_id: newAssetId, ...data };
};

/**
 * Get details for a single asset.
 */
const getAssetById = async (id) => {
  const query = `
    SELECT 
      a.*,
      c.category_name,
      d.department_name,
      l.location_name,
      s.lookup_value AS status,
      cond.lookup_value AS asset_condition
    FROM assets a
    JOIN asset_categories c ON a.category_id = c.category_id
    LEFT JOIN departments d ON a.department_id = d.department_id
    LEFT JOIN locations l ON a.location_id = l.location_id
    JOIN lookup_values s ON a.status_lookup_id = s.lookup_id
    JOIN lookup_values cond ON a.condition_lookup_id = cond.lookup_id
    WHERE a.asset_id = ?
  `;
  const [rows] = await pool.query(query, [id]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Update an asset.
 */
const updateAsset = async (id, data, userId) => {
  const oldAsset = await getAssetById(id);
  if (!oldAsset) return null;

  const fields = [];
  const params = [];

  const updatableKeys = [
    'category_id', 'department_id', 'location_id', 'status_lookup_id', 'condition_lookup_id',
    'asset_tag', 'asset_name', 'serial_number', 'manufacturer', 'model',
    'acquisition_date', 'acquisition_cost', 'warranty_expiry', 'qr_code', 'is_bookable', 'notes'
  ];

  for (const key of updatableKeys) {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      // Convert boolean is_bookable to integer
      if (key === 'is_bookable') {
        params.push(data[key] ? 1 : 0);
      } else {
        params.push(data[key] === '' ? null : data[key]);
      }
    }
  }

  if (fields.length === 0) return oldAsset;

  params.push(id);
  await pool.query(`UPDATE assets SET ${fields.join(', ')} WHERE asset_id = ?`, params);

  // Sync Resource table if is_bookable changes
  if (data.is_bookable !== undefined) {
    if (data.is_bookable) {
      const [res] = await pool.query('SELECT resource_id FROM resources WHERE asset_id = ?', [id]);
      if (res.length === 0) {
        await pool.query(
          `INSERT INTO resources (asset_id, resource_name, booking_type, is_active) VALUES (?, ?, 'Equipment', 1)`,
          [id, data.asset_name || oldAsset.asset_name]
        );
      }
    } else {
      await pool.query('DELETE FROM resources WHERE asset_id = ?', [id]);
    }
  }

  const updatedAsset = await getAssetById(id);

  // Log update history
  await logAssetHistory(id, 'UPDATE', oldAsset, updatedAsset, userId, 'Asset details updated.');

  return updatedAsset;
};

/**
 * Delete or soft-retire an asset.
 */
const deleteAsset = async (id, userId) => {
  const oldAsset = await getAssetById(id);
  if (!oldAsset) return false;

  // Check if asset is allocated
  if (parseInt(oldAsset.status_lookup_id) === 2) {
    throw new Error('Cannot delete an asset that is currently allocated.');
  }

  // Attempt hard delete first. If foreign key constraints restrict it, fall back to soft deactivation.
  try {
    await pool.query('DELETE FROM resources WHERE asset_id = ?', [id]);
    await pool.query('DELETE FROM asset_history WHERE asset_id = ?', [id]);
    await pool.query('DELETE FROM assets WHERE asset_id = ?', [id]);
  } catch (err) {
    // Soft retire asset (statusRetired = 6)
    await pool.query('UPDATE assets SET status_lookup_id = 6 WHERE asset_id = ?', [id]);
    await logAssetHistory(id, 'DELETE', oldAsset, { status_lookup_id: 6 }, userId, 'Soft-deleted / Retired asset.');
  }

  return true;
};

/**
 * List assets with advanced query filters and search.
 */
const listAssets = async (filters = {}) => {
  const { search, categoryId, departmentId, statusId, conditionId } = filters;

  let query = `
    SELECT 
      a.*,
      c.category_name,
      d.department_name,
      l.location_name,
      s.lookup_value AS status,
      cond.lookup_value AS asset_condition
    FROM assets a
    JOIN asset_categories c ON a.category_id = c.category_id
    LEFT JOIN departments d ON a.department_id = d.department_id
    LEFT JOIN locations l ON a.location_id = l.location_id
    JOIN lookup_values s ON a.status_lookup_id = s.lookup_id
    JOIN lookup_values cond ON a.condition_lookup_id = cond.lookup_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ' AND (a.asset_name LIKE ? OR a.asset_tag LIKE ? OR a.serial_number LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  if (categoryId) {
    query += ' AND a.category_id = ?';
    params.push(categoryId);
  }

  if (departmentId) {
    query += ' AND a.department_id = ?';
    params.push(departmentId);
  }

  if (statusId) {
    query += ' AND a.status_lookup_id = ?';
    params.push(statusId);
  }

  if (conditionId) {
    query += ' AND a.condition_lookup_id = ?';
    params.push(conditionId);
  }

  query += ' ORDER BY a.created_at DESC';

  const [rows] = await pool.query(query, params);
  return rows;
};

/**
 * Get history logs for a specific asset.
 */
const getAssetHistory = async (assetId) => {
  const query = `
    SELECT h.*, u.full_name AS performed_by
    FROM asset_history h
    LEFT JOIN users u ON h.changed_by = u.id
    WHERE h.asset_id = ?
    ORDER BY h.created_at DESC
  `;
  const [rows] = await pool.query(query, [assetId]);
  return rows;
};

module.exports = {
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetById,
  getAssetHistory,
  getAssetByQRCodeOrTag,
  listAssets
};
