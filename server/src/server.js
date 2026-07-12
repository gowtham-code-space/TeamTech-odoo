const app = require('./app');
const config = require('./config/env');
const db = require('./config/db');

const PORT = config.port || 5000;

// Start listening for connections
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  AssetFlow Backend API Server running successfully!`);
  console.log(`  Mode:        ${config.nodeEnv || 'development'}`);
  console.log(`  Port:        ${PORT}`);
  console.log(`  Health:      http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});

// Centralized handler for graceful shutdowns (closes server listeners & db connections)
const gracefulShutdown = async (signal) => {
  console.log(`Received signal ${signal}. Starting graceful shutdown...`);
  
  server.close(async () => {
    console.log('HTTP server listener closed.');
    
    try {
      // Close database connection pool
      await db.pool.end();
      console.log('Database connection pool terminated successfully.');
      process.exit(0);
    } catch (err) {
      console.error('Error while closing database connection pool:', err.message);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10s if connections persist
  setTimeout(() => {
    console.error('Graceful shutdown timeout exceeded. Forcing termination.');
    process.exit(1);
  }, 10000);
};

// Monitor system termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Capture unhandled promise rejections outside Express's lifecycle
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection detected:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception detected:', error.message);
  console.error(error.stack);
  process.exit(1);
});
