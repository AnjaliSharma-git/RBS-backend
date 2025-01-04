const express = require('express');
const router = express.Router();
const { createBooking, getBookings, deleteBooking, deleteBookingByUser, getBookingsByUser, getAvailableTimeSlots, getBookingsInRange } = require('../controllers/bookingController');

router.post('/create', createBooking);
router.get('/all', getBookings);
router.delete('/delete/:id', deleteBooking); 
router.delete('/delete-by-user/:id', deleteBookingByUser);
router.get('/bookings-by-user', getBookingsByUser); 
router.get('/available-slots', getAvailableTimeSlots);
router.get('/bookings-in-range', getBookingsInRange);

module.exports = router;
