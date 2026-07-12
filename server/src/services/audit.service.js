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
 * Create a new audit cycle.
 */
const createAuditCycle = async (departmentId, locationId, startDate, endDate, createdBy) => {
  // 34 = Scheduled status
  const [result] = await pool.query(
    `INSERT INTO audit_cycles (department_id, location_id, status_lookup_id, start_date, end_date, created_by) 
     VALUES (?, ?, 34, ?, ?, ?)`,
    [departmentId || null, locationId || null, startDate, endDate, createdBy]
  );
  return { audit_cycle_id: result.insertId };
};

/**
 * Assign auditors to a cycle.
 */
const assignAuditors = async (auditCycleId, auditorIds) => {
  // Clear previous assignments for this cycle
  await pool.query('DELETE FROM audit_assignments WHERE audit_cycle_id = ?', [auditCycleId]);

  if (auditorIds && auditorIds.length > 0) {
    for (const auditorId of auditorIds) {
      await pool.query(
        'INSERT INTO audit_assignments (audit_cycle_id, auditor_id) VALUES (?, ?)',
        [auditCycleId, auditorId]
      );
      // Notification record for assignment
      await pool.query(
        'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
        [auditorId, 'Audit Assigned', `You have been assigned to audit cycle ID: ${auditCycleId}`]
      );
    }
  }
  return { audit_cycle_id: auditCycleId };
};

/**
 * Set audit status to In Progress.
 */
const startAudit = async (auditCycleId) => {
  await pool.query(
    'UPDATE audit_cycles SET status_lookup_id = 35 WHERE audit_cycle_id = ?',
    [auditCycleId]
  );
  return { audit_cycle_id: auditCycleId };
};

/**
 * Verify asset status during audit.
 */
const verifyAsset = async (auditCycleId, assetId, verifiedBy, resultLookupId, remarks) => {
  // Insert or update result
  await pool.query(
    `INSERT INTO audit_results (audit_cycle_id, asset_id, verified_by, result_lookup_id, remarks) 
     VALUES (?, ?, ?, ?, ?) 
     ON DUPLICATE KEY UPDATE verified_by = ?, result_lookup_id = ?, remarks = ?, verified_at = CURRENT_TIMESTAMP`,
    [auditCycleId, assetId, verifiedBy, resultLookupId, remarks || null, verifiedBy, resultLookupId, remarks || null]
  );

  // Sync back to assets table depending on verification findings
  if (parseInt(resultLookupId) === 39) {
    // Missing: Set status to 5 (Lost)
    await pool.query('UPDATE assets SET status_lookup_id = 5 WHERE asset_id = ?', [assetId]);
    await logAssetHistory(assetId, 'AUDIT_MISSING', null, null, verifiedBy, 'Asset reported missing during compliance audit.');
  } else if (parseInt(resultLookupId) === 40) {
    // Damaged: Set condition to 12 (Damaged) and status to 4 (Under Maintenance)
    await pool.query('UPDATE assets SET condition_lookup_id = 12, status_lookup_id = 4 WHERE asset_id = ?', [assetId]);
    await logAssetHistory(assetId, 'AUDIT_DAMAGED', null, null, verifiedBy, 'Asset reported damaged during compliance audit.');
  } else {
    // Verified: Set status to 1 (Available)
    await pool.query('UPDATE assets SET status_lookup_id = 1 WHERE asset_id = ?', [assetId]);
  }

  return { asset_id: assetId };
};

/**
 * Get discrepancy report for a cycle.
 */
const getDiscrepancyReport = async (auditCycleId) => {
  const query = `
    SELECT 
      ar.*,
      ast.asset_name,
      ast.asset_tag,
      ast.serial_number,
      u.full_name AS verified_by_name,
      s.lookup_value AS result_status
    FROM audit_results ar
    JOIN assets ast ON ar.asset_id = ast.asset_id
    JOIN users u ON ar.verified_by = u.id
    JOIN lookup_values s ON ar.result_lookup_id = s.lookup_id
    WHERE ar.audit_cycle_id = ? AND ar.result_lookup_id IN (39, 40)
  `;
  const [rows] = await pool.query(query, [auditCycleId]);
  return rows;
};

/**
 * Close audit cycle.
 */
const closeAudit = async (auditCycleId) => {
  // 37 = Closed status
  await pool.query(
    'UPDATE audit_cycles SET status_lookup_id = 37 WHERE audit_cycle_id = ?',
    [auditCycleId]
  );
  return { audit_cycle_id: auditCycleId };
};

/**
 * List audit cycles.
 */
const listCycles = async () => {
  const query = `
    SELECT 
      ac.*,
      d.department_name,
      l.location_name,
      s.lookup_value AS audit_status,
      u.full_name AS creator_name,
      (SELECT COUNT(*) FROM audit_assignments aa WHERE aa.audit_cycle_id = ac.audit_cycle_id) AS auditors_count
    FROM audit_cycles ac
    LEFT JOIN departments d ON ac.department_id = d.department_id
    LEFT JOIN locations l ON ac.location_id = l.location_id
    JOIN lookup_values s ON ac.status_lookup_id = s.lookup_id
    JOIN users u ON ac.created_by = u.id
    ORDER BY ac.created_at DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

module.exports = {
  createAuditCycle,
  assignAuditors,
  startAudit,
  verifyAsset,
  getDiscrepancyReport,
  closeAudit,
  listCycles
};
