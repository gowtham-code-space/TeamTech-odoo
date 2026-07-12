const app = require('./app');
const config = require('./config/env');

// Import DB so that MySQL initialization and seeds run
require('./config/db');

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  AssetFlow API Server running in ${config.nodeEnv} mode`);
  console.log(`  Listening on port: http://localhost:${PORT}`);
  console.log(`====================================================`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('Shutting down server gracefully...');
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
