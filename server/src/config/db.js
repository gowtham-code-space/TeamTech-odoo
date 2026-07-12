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
    connection = await pool.getConnection();
    console.log(`Successfully connected to MySQL database: "${config.db.database}"`);

    // Create users table if not exists
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        department VARCHAR(255) DEFAULT NULL,
        organization_id VARCHAR(255) DEFAULT NULL,
        tenant_id VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await connection.query(createUsersTableQuery);
    console.log('Verified database tables structure successfully.');

    // DEVELOPMENT SEEDING ONLY:
    // These accounts are seeded solely for development testing and system demo evaluation.
    // Production Flow: 
    // - New signups must always register as "EMPLOYEE" by default.
    // - Elevated roles (ASSET_MANAGER, DEPARTMENT_HEAD) can only be granted by an ADMIN
    //   via the Admin User Directory promotion workflow.
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      console.log('Seeding default DEVELOPMENT demo accounts...');
      
      const seedUsers = [
        {
          full_name: 'System Admin',
          email: 'admin@assetflow.com',
          password: 'Admin@123',
          role: 'ADMIN',
          department: 'IT Administration',
          organization_id: 'org_admin_flow',
          tenant_id: 'ten_main_flow',
        },
        {
          full_name: 'Asset Manager',
          email: 'manager@assetflow.com',
          password: 'Manager@123',
          role: 'ASSET_MANAGER',
          department: 'Procurement',
          organization_id: 'org_admin_flow',
          tenant_id: 'ten_main_flow',
        },
        {
          full_name: 'Department Head',
          email: 'hod@assetflow.com',
          password: 'Hod@123',
          role: 'DEPARTMENT_HEAD',
          department: 'Engineering',
          organization_id: 'org_admin_flow',
          tenant_id: 'ten_main_flow',
        },
        {
          full_name: 'Regular Employee',
          email: 'employee@assetflow.com',
          password: 'Employee@123',
          role: 'EMPLOYEE',
          department: 'Engineering',
          organization_id: 'org_admin_flow',
          tenant_id: 'ten_main_flow',
        }
      ];

      for (const user of seedUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await connection.query(
          `INSERT INTO users (full_name, email, password, role, department, organization_id, tenant_id) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [user.full_name, user.email, hashedPassword, user.role, user.department, user.organization_id, user.tenant_id]
        );
      }
      console.log('Demo accounts seeded successfully.');
    }
  } catch (error) {
    console.error('MySQL Connection or Setup failed:');
    console.error(error.message);
    console.log(`Please verify that MySQL server is active and the database "${config.db.database}" exists on host: ${config.db.host}:${config.db.port}`);
    process.exit(1); // Stop execution on DB failure
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
