const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const config = require('./env');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database schema and default seeds
const initDb = async () => {
  let connection;
  try {
    // Dynamically create database if not exists to avoid server crash
    const tempConnection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password
    });
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.database}\``);
    await tempConnection.end();

    connection = await pool.getConnection();
    console.log(`Successfully connected to MySQL database: "${config.db.database}"`);

    // 1. Create users table
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('SUPER_ADMIN', 'ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        department VARCHAR(255) DEFAULT NULL,
        department_id BIGINT UNSIGNED DEFAULT NULL,
        organization_id VARCHAR(255) DEFAULT NULL,
        tenant_id VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createUsersTableQuery);

    // 2. Create departments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS departments (
        department_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        department_name VARCHAR(150) NOT NULL UNIQUE,
        parent_department_id BIGINT UNSIGNED DEFAULT NULL,
        department_head_id INT DEFAULT NULL,
        description TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_dept_parent FOREIGN KEY (parent_department_id) REFERENCES departments(department_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_dept_head FOREIGN KEY (department_head_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Create locations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS locations (
        location_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        department_id BIGINT UNSIGNED DEFAULT NULL,
        location_name VARCHAR(150) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_location_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create asset_categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS asset_categories (
        category_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Create lookup_values table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS lookup_values (
        lookup_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        lookup_type VARCHAR(50) NOT NULL,
        lookup_value VARCHAR(100) NOT NULL,
        display_order INT DEFAULT 1,
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_lookup (lookup_type, lookup_value)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed lookup values if empty
    const [existingLookups] = await connection.query('SELECT COUNT(*) AS count FROM lookup_values');
    if (existingLookups[0].count === 0) {
      const seedLookups = [
        // ASSET_STATUS
        { id: 1, type: 'ASSET_STATUS', value: 'Available', order: 1 },
        { id: 2, type: 'ASSET_STATUS', value: 'Allocated', order: 2 },
        { id: 3, type: 'ASSET_STATUS', value: 'Reserved', order: 3 },
        { id: 4, type: 'ASSET_STATUS', value: 'Under Maintenance', order: 4 },
        { id: 5, type: 'ASSET_STATUS', value: 'Lost', order: 5 },
        { id: 6, type: 'ASSET_STATUS', value: 'Retired', order: 6 },
        { id: 7, type: 'ASSET_STATUS', value: 'Disposed', order: 7 },
        // ASSET_CONDITION
        { id: 8, type: 'ASSET_CONDITION', value: 'Excellent', order: 1 },
        { id: 9, type: 'ASSET_CONDITION', value: 'Good', order: 2 },
        { id: 10, type: 'ASSET_CONDITION', value: 'Fair', order: 3 },
        { id: 11, type: 'ASSET_CONDITION', value: 'Poor', order: 4 },
        { id: 12, type: 'ASSET_CONDITION', value: 'Damaged', order: 5 },
        // ALLOCATION_STATUS
        { id: 13, type: 'ALLOCATION_STATUS', value: 'Active', order: 1 },
        { id: 14, type: 'ALLOCATION_STATUS', value: 'Returned', order: 2 },
        { id: 15, type: 'ALLOCATION_STATUS', value: 'Overdue', order: 3 },
        // TRANSFER_STATUS
        { id: 16, type: 'TRANSFER_STATUS', value: 'Requested', order: 1 },
        { id: 17, type: 'TRANSFER_STATUS', value: 'Approved', order: 2 },
        { id: 18, type: 'TRANSFER_STATUS', value: 'Rejected', order: 3 },
        { id: 19, type: 'TRANSFER_STATUS', value: 'Completed', order: 4 },
        // BOOKING_STATUS
        { id: 20, type: 'BOOKING_STATUS', value: 'Upcoming', order: 1 },
        { id: 21, type: 'BOOKING_STATUS', value: 'Ongoing', order: 2 },
        { id: 22, type: 'BOOKING_STATUS', value: 'Completed', order: 3 },
        { id: 23, type: 'BOOKING_STATUS', value: 'Cancelled', order: 4 },
        // MAINTENANCE_STATUS
        { id: 24, type: 'MAINTENANCE_STATUS', value: 'Pending', order: 1 },
        { id: 25, type: 'MAINTENANCE_STATUS', value: 'Approved', order: 2 },
        { id: 26, type: 'MAINTENANCE_STATUS', value: 'Rejected', order: 3 },
        { id: 27, type: 'MAINTENANCE_STATUS', value: 'Technician Assigned', order: 4 },
        { id: 28, type: 'MAINTENANCE_STATUS', value: 'In Progress', order: 5 },
        { id: 29, type: 'MAINTENANCE_STATUS', value: 'Resolved', order: 6 },
        // PRIORITY
        { id: 30, type: 'PRIORITY', value: 'Low', order: 1 },
        { id: 31, type: 'PRIORITY', value: 'Medium', order: 2 },
        { id: 32, type: 'PRIORITY', value: 'High', order: 3 },
        { id: 33, type: 'PRIORITY', value: 'Critical', order: 4 },
        // AUDIT_STATUS
        { id: 34, type: 'AUDIT_STATUS', value: 'Scheduled', order: 1 },
        { id: 35, type: 'AUDIT_STATUS', value: 'In Progress', order: 2 },
        { id: 36, type: 'AUDIT_STATUS', value: 'Completed', order: 3 },
        { id: 37, type: 'AUDIT_STATUS', value: 'Closed', order: 4 },
        // AUDIT_RESULT
        { id: 38, type: 'AUDIT_RESULT', value: 'Verified', order: 1 },
        { id: 39, type: 'AUDIT_RESULT', value: 'Missing', order: 2 },
        { id: 40, type: 'AUDIT_RESULT', value: 'Damaged', order: 3 },
        // RESOURCE_TYPE
        { id: 41, type: 'RESOURCE_TYPE', value: 'Meeting Room', order: 1 },
        { id: 42, type: 'RESOURCE_TYPE', value: 'Conference Hall', order: 2 },
        { id: 43, type: 'RESOURCE_TYPE', value: 'Vehicle', order: 3 },
        { id: 44, type: 'RESOURCE_TYPE', value: 'Projector', order: 4 },
        { id: 45, type: 'RESOURCE_TYPE', value: 'Equipment', order: 5 },
        // NOTIFICATION_TYPE
        { id: 46, type: 'NOTIFICATION_TYPE', value: 'Asset Assigned', order: 1 },
        { id: 47, type: 'NOTIFICATION_TYPE', value: 'Asset Returned', order: 2 },
        { id: 48, type: 'NOTIFICATION_TYPE', value: 'Transfer Approved', order: 3 },
        { id: 49, type: 'NOTIFICATION_TYPE', value: 'Booking Confirmed', order: 4 },
        { id: 50, type: 'NOTIFICATION_TYPE', value: 'Booking Reminder', order: 5 },
        { id: 51, type: 'NOTIFICATION_TYPE', value: 'Maintenance Approved', order: 6 },
        { id: 52, type: 'NOTIFICATION_TYPE', value: 'Maintenance Completed', order: 7 },
        { id: 53, type: 'NOTIFICATION_TYPE', value: 'Audit Assigned', order: 8 },
        { id: 54, type: 'NOTIFICATION_TYPE', value: 'Overdue Return', order: 9 }
      ];

      for (const item of seedLookups) {
        await connection.query(
          `INSERT INTO lookup_values (lookup_id, lookup_type, lookup_value, display_order, is_active) 
           VALUES (?, ?, ?, ?, 1)`,
          [item.id, item.type, item.value, item.order]
        );
      }
      console.log('Seeded lookup_values successfully.');
    }

    // 6. Create assets table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS assets (
        asset_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_id BIGINT UNSIGNED NOT NULL,
        department_id BIGINT UNSIGNED DEFAULT NULL,
        location_id BIGINT UNSIGNED DEFAULT NULL,
        status_lookup_id BIGINT UNSIGNED NOT NULL,
        condition_lookup_id BIGINT UNSIGNED NOT NULL,
        created_by INT DEFAULT NULL,
        asset_tag VARCHAR(50) NOT NULL UNIQUE,
        asset_name VARCHAR(200) NOT NULL,
        serial_number VARCHAR(150) UNIQUE,
        manufacturer VARCHAR(100),
        model VARCHAR(100),
        acquisition_date DATE,
        acquisition_cost DECIMAL(12,2),
        warranty_expiry DATE,
        qr_code VARCHAR(255),
        is_bookable TINYINT(1) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_asset_category FOREIGN KEY (category_id) REFERENCES asset_categories(category_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_asset_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_asset_location FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_asset_status FOREIGN KEY (status_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_asset_condition FOREIGN KEY (condition_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_asset_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 7. Create asset_history table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS asset_history (
        history_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        asset_id BIGINT UNSIGNED NOT NULL,
        action VARCHAR(100) NOT NULL,
        old_value TEXT,
        new_value TEXT,
        changed_by INT DEFAULT NULL,
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_history_asset FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_history_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 8. Create asset_allocations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS asset_allocations (
        allocation_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        asset_id BIGINT UNSIGNED NOT NULL,
        user_id INT NOT NULL,
        allocated_by INT DEFAULT NULL,
        expected_return_date DATE,
        actual_return_date DATE,
        status_lookup_id BIGINT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_allocation_asset FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_allocation_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_allocation_allocated_by FOREIGN KEY (allocated_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_allocation_status FOREIGN KEY (status_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 9. Create asset_transfers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS asset_transfers (
        transfer_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        asset_id BIGINT UNSIGNED NOT NULL,
        from_user_id INT NOT NULL,
        to_user_id INT NOT NULL,
        approved_by INT DEFAULT NULL,
        status_lookup_id BIGINT UNSIGNED NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_transfer_asset FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_transfer_from_user FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_transfer_to_user FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_transfer_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_transfer_status FOREIGN KEY (status_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 10. Create resources table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resources (
        resource_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        asset_id BIGINT UNSIGNED NOT NULL,
        resource_name VARCHAR(200) NOT NULL,
        booking_type VARCHAR(50),
        is_active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_resource_asset FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 11. Create resource_bookings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS resource_bookings (
        booking_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        resource_id BIGINT UNSIGNED NOT NULL,
        booked_by INT NOT NULL,
        start_datetime DATETIME NOT NULL,
        end_datetime DATETIME NOT NULL,
        status_lookup_id BIGINT UNSIGNED NOT NULL,
        purpose TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_booking_resource FOREIGN KEY (resource_id) REFERENCES resources(resource_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_booking_user FOREIGN KEY (booked_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_booking_status FOREIGN KEY (status_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 12. Create maintenance_requests table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS maintenance_requests (
        maintenance_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        asset_id BIGINT UNSIGNED NOT NULL,
        requested_by INT NOT NULL,
        approved_by INT DEFAULT NULL,
        priority_lookup_id BIGINT UNSIGNED NOT NULL,
        status_lookup_id BIGINT UNSIGNED NOT NULL,
        issue_description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_maint_asset FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_maint_requested_by FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_maint_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_maint_priority FOREIGN KEY (priority_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_maint_status FOREIGN KEY (status_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 13. Create maintenance_updates table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS maintenance_updates (
        update_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        maintenance_id BIGINT UNSIGNED NOT NULL,
        updated_by INT NOT NULL,
        status_lookup_id BIGINT UNSIGNED NOT NULL,
        comments TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_update_maint FOREIGN KEY (maintenance_id) REFERENCES maintenance_requests(maintenance_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_update_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_update_status FOREIGN KEY (status_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 14. Create audit_cycles table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_cycles (
        audit_cycle_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        department_id BIGINT UNSIGNED DEFAULT NULL,
        location_id BIGINT UNSIGNED DEFAULT NULL,
        status_lookup_id BIGINT UNSIGNED NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_audit_dept FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_audit_loc FOREIGN KEY (location_id) REFERENCES locations(location_id) ON DELETE SET NULL ON UPDATE CASCADE,
        CONSTRAINT fk_audit_status FOREIGN KEY (status_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_audit_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 15. Create audit_assignments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_assignments (
        assignment_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        audit_cycle_id BIGINT UNSIGNED NOT NULL,
        auditor_id INT NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_assign_cycle FOREIGN KEY (audit_cycle_id) REFERENCES audit_cycles(audit_cycle_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_assign_auditor FOREIGN KEY (auditor_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 16. Create audit_results table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_results (
        result_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        audit_cycle_id BIGINT UNSIGNED NOT NULL,
        asset_id BIGINT UNSIGNED NOT NULL,
        verified_by INT NOT NULL,
        result_lookup_id BIGINT UNSIGNED NOT NULL,
        remarks TEXT,
        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_res_cycle FOREIGN KEY (audit_cycle_id) REFERENCES audit_cycles(audit_cycle_id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_res_asset FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_res_user FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_res_lookup FOREIGN KEY (result_lookup_id) REFERENCES lookup_values(lookup_id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 17. Create notifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Ensure users table has department_id for relation support
    const [cols] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'department_id'
    `);
    if (cols.length === 0) {
      await connection.query('ALTER TABLE users ADD COLUMN department_id BIGINT UNSIGNED DEFAULT NULL');
      await connection.query(`
        ALTER TABLE users ADD CONSTRAINT fk_users_department_id 
        FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL ON UPDATE CASCADE
      `);
    }

    console.log('Verified database tables structure successfully.');

    // Seed default development accounts
    const { ROLES } = require('../utils/constants');
    const seedUsers = [
      {
        full_name: 'System Admin',
        email: 'admin@assetflow.com',
        password: 'Admin@123',
        role: ROLES.ADMIN,
        department: 'IT Administration',
        organization_id: 'org_admin_flow',
        tenant_id: 'ten_main_flow',
      },
      {
        full_name: 'Asset Manager',
        email: 'manager@assetflow.com',
        password: 'Manager@123',
        role: ROLES.ASSET_MANAGER,
        department: 'Procurement',
        organization_id: 'org_admin_flow',
        tenant_id: 'ten_main_flow',
      },
      {
        full_name: 'Department Head',
        email: 'hod@assetflow.com',
        password: 'Hod@123',
        role: ROLES.DEPARTMENT_HEAD,
        department: 'Engineering',
        organization_id: 'org_admin_flow',
        tenant_id: 'ten_main_flow',
      },
      {
        full_name: 'Regular Employee',
        email: 'employee@assetflow.com',
        password: 'Employee@123',
        role: ROLES.EMPLOYEE,
        department: 'Engineering',
        organization_id: 'org_admin_flow',
        tenant_id: 'ten_main_flow',
      }
    ];

    let seedCount = 0;
    for (const user of seedUsers) {
      const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [user.email]);
      if (existing.length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await connection.query(
          `INSERT INTO users (full_name, email, password, role, department, organization_id, tenant_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [user.full_name, user.email, hashedPassword, user.role, user.department, user.organization_id, user.tenant_id]
        );
        seedCount++;
      }
    }
    if (seedCount > 0) {
      console.log(`Seeded ${seedCount} default DEVELOPMENT demo accounts successfully.`);
    }
  } catch (error) {
    console.error('MySQL Connection or Setup failed:');
    console.error(error.message);
    console.log(`Please verify that MySQL server is active and the database "${config.db.database}" exists on host: ${config.db.host}:${config.db.port}`);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
};

// Execute DB initialization
initDb();

module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params)
};
