const { pool } = require('../config/db');

/**
 * Report 1: Asset Utilization Rate & status distribution.
 */
const getAssetUtilization = async () => {
  const distributionQuery = `
    SELECT 
      s.lookup_id AS status_id,
      s.lookup_value AS status_name, 
      COUNT(a.asset_id) AS count
    FROM lookup_values s
    LEFT JOIN assets a ON s.lookup_id = a.status_lookup_id
    WHERE s.lookup_type = 'ASSET_STATUS'
    GROUP BY s.lookup_id, s.lookup_value
  `;
  const [distribution] = await pool.query(distributionQuery);

  const totalQuery = 'SELECT COUNT(*) AS total FROM assets';
  const allocatedQuery = "SELECT COUNT(*) AS allocated FROM assets WHERE status_lookup_id = 2";

  const [totalResult] = await pool.query(totalQuery);
  const [allocatedResult] = await pool.query(allocatedQuery);

  const total = totalResult[0].total || 0;
  const allocated = allocatedResult[0].allocated || 0;
  const rate = total > 0 ? ((allocated / total) * 100).toFixed(2) : 0;

  return {
    utilization_rate_percentage: parseFloat(rate),
    total_assets: total,
    allocated_assets: allocated,
    status_distribution: distribution
  };
};

/**
 * Report 2: Maintenance Frequency.
 */
const getMaintenanceFrequency = async () => {
  const query = `
    SELECT 
      a.asset_id, 
      a.asset_name, 
      a.asset_tag, 
      COUNT(m.maintenance_id) AS maintenance_count
    FROM assets a
    LEFT JOIN maintenance_requests m ON a.asset_id = m.asset_id
    GROUP BY a.asset_id, a.asset_name, a.asset_tag
    ORDER BY maintenance_count DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Report 3: Department Allocation Summary.
 */
const getDepartmentAllocationSummary = async () => {
  const query = `
    SELECT 
      d.department_id, 
      d.department_name, 
      COUNT(a.asset_id) AS allocated_count,
      COALESCE(SUM(a.acquisition_cost), 0) AS total_cost
    FROM departments d
    LEFT JOIN assets a ON d.department_id = a.department_id AND a.status_lookup_id = 2
    GROUP BY d.department_id, d.department_name
    ORDER BY allocated_count DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Report 4: Idle Assets.
 */
const getIdleAssets = async () => {
  // Idle assets are those whose status is 'Available' (status_lookup_id = 1)
  const query = `
    SELECT 
      a.asset_id, 
      a.asset_name, 
      a.asset_tag, 
      c.category_name, 
      a.acquisition_cost, 
      a.created_at
    FROM assets a
    JOIN asset_categories c ON a.category_id = c.category_id
    WHERE a.status_lookup_id = 1
    ORDER BY a.created_at ASC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Report 5: Resource Booking Heatmap.
 */
const getBookingHeatmap = async () => {
  const query = `
    SELECT 
      r.resource_name, 
      r.booking_type,
      COUNT(b.booking_id) AS total_bookings
    FROM resources r
    LEFT JOIN resource_bookings b ON r.resource_id = b.resource_id AND b.status_lookup_id != 23
    GROUP BY r.resource_id, r.resource_name, r.booking_type
    ORDER BY total_bookings DESC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Report 6: Retirement Forecast.
 */
const getRetirementForecast = async () => {
  // Forecast retirement for assets past warranty or older than 5 years
  const query = `
    SELECT 
      a.asset_id, 
      a.asset_name, 
      a.asset_tag, 
      a.warranty_expiry, 
      a.acquisition_date,
      CASE 
        WHEN a.warranty_expiry IS NOT NULL AND a.warranty_expiry <= CURDATE() THEN 'WARRANTY_EXPIRED'
        WHEN a.acquisition_date <= DATE_SUB(CURDATE(), INTERVAL 5 YEAR) THEN 'DEPRECIATED_LIMIT'
        ELSE 'UPCOMING_RETIREMENT'
      END AS forecast_reason
    FROM assets a
    WHERE (a.warranty_expiry IS NOT NULL AND a.warranty_expiry <= DATE_ADD(CURDATE(), INTERVAL 6 MONTH))
       OR a.acquisition_date <= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)
    ORDER BY a.warranty_expiry ASC, a.acquisition_date ASC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

module.exports = {
  getAssetUtilization,
  getMaintenanceFrequency,
  getDepartmentAllocationSummary,
  getIdleAssets,
  getBookingHeatmap,
  getRetirementForecast
};
