const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const config = require('./config/env');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // Essential for serving uploaded image assets safely
}));
app.use(cors({
  origin: '*', // Customize this as needed for production client URL
  credentials: true
}));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check & Root Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the AssetFlow API Server.' });
});

/**
 * Safe Route Loader:
 * Ensures that if a route file is empty or missing exports,
 * it returns a fallback router that sends a "501 Not Implemented" response
 * instead of crashing the application on server startup.
 */
const safeLoadRouter = (routePath) => {
  try {
    const routeModule = require(routePath);
    // Express routers are functions. Check if the module exports a function.
    if (typeof routeModule === 'function') {
      return routeModule;
    }
    console.warn(`[Safe Loader Warning] Route at ${routePath} does not export a router function (it may be empty). Using 501 fallback.`);
  } catch (error) {
    console.warn(`[Safe Loader Warning] Route at ${routePath} couldn't be loaded. Using 501 fallback:`, error.message);
  }
  
  const fallbackRouter = express.Router();
  fallbackRouter.use((req, res) => {
    res.status(501).json({
      success: false,
      message: `Endpoint ${req.originalUrl} (${req.method}) is defined but not yet implemented in the backend.`
    });
  });
  return fallbackRouter;
};

// API Routes Mounting
app.use('/api/auth', safeLoadRouter('./routes/auth.routes'));
app.use('/api/assets', safeLoadRouter('./routes/asset.routes'));
app.use('/api/allocations', safeLoadRouter('./routes/allocation.routes'));
app.use('/api/bookings', safeLoadRouter('./routes/booking.routes'));
app.use('/api/maintenances', safeLoadRouter('./routes/maintenance.routes'));
app.use('/api/audits', safeLoadRouter('./routes/audit.routes'));
app.use('/api/notifications', safeLoadRouter('./routes/notification.routes'));
app.use('/api/organization', safeLoadRouter('./routes/organization.routes'));
app.use('/api/reports', safeLoadRouter('./routes/report.routes'));
app.use('/api/dashboard', safeLoadRouter('./routes/dashboard.routes'));

// Catch-All 404 Route
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized Error-Handling Middleware
app.use(errorHandler);

module.exports = app;
