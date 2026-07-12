const mysql = require('mysql2/promise');
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

// Test connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database.');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Please ensure MySQL is running and database configuration in .env is correct.');
  }
})();

module.exports = {
  pool,
  query: (sql, params) => pool.query(sql, params)
};
