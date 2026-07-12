const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { error } = require('./utils/response');

// Import routers
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Standard middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins for local hackathon development
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Base health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'AssetFlow API Server' });
});

// 404 Route handler
app.use((req, res, next) => {
  return error(res, `Route not found: ${req.originalUrl}`, 404);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('API Server uncaught exception:', err);
  return error(res, 'Internal server error occurred.', 500, err.message);
});

module.exports = app;
