const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const requireAuth = require('../middleware/auth.middleware');

// Ensure only authenticated users can access booking endpoints
router.use(requireAuth);

// Booking endpoints
router.get('/', bookingController.getBookings);
router.get('/resources', bookingController.getResources);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.cancelBooking);

module.exports = router;
