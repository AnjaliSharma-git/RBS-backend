const Booking = require('../models/bookingModel');

const MAX_GUESTS_PER_SLOT = 25; 

const createBooking = async (req, res) => {
  const { date, time, guests, name, contact } = req.body;

  try {
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required.' });
    }

    const bookingsAtTime = await Booking.find({ date, time });
    console.log('Bookings at this time:', bookingsAtTime);

    const parsedGuests = parseInt(guests, 10);
    if (isNaN(parsedGuests) || parsedGuests <= 0) {
      return res.status(400).json({ message: 'Invalid guest count. Please enter a positive number.' });
    }

    const totalGuestsAtTime = bookingsAtTime.reduce(
      (total, booking) => total + booking.guests,
      0
    );
    console.log('Total guests at this time:', totalGuestsAtTime);

    if (totalGuestsAtTime + parsedGuests > MAX_GUESTS_PER_SLOT) {
      return res.status(400).json({
        message: `Cannot book. The total guest capacity of ${MAX_GUESTS_PER_SLOT} for this time slot has been reached.`,
      });
    }

    const newBooking = new Booking({
      date,
      time,
      guests: parsedGuests,
      name,
      contact,
    });
    await newBooking.save();

    res.status(201).json({ message: 'Booking successful!', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      message: 'An error occurred while creating the booking.',
      error: error.message || error,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Booking.deleteOne({ _id: id });
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

const deleteBookingByUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.name !== name) {
      return res.status(403).json({ message: 'You can only delete your own bookings.' });
    }

    await Booking.deleteOne({ _id: id });
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};
const getBookingsByUser = async (req, res) => {
  const { name } = req.query;

  try {
    const bookings = await Booking.find({ name });
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this name.' });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const allSlots = [
  '10:00 AM',
  '12:00 PM',
  '2:00 PM',
  '4:00 PM',
  '6:00 PM',
  '8:00 PM',
  '10:00 PM',
];

const getAvailableTimeSlots = async (req, res) => {
  const { date } = req.query;

  try {
    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }

    const bookings = await Booking.find({ date });

    const slotGuestCounts = bookings.reduce((acc, booking) => {
      acc[booking.time] = (acc[booking.time] || 0) + booking.guests;
      return acc;
    }, {});

    const availableSlots = allSlots.filter(
      (slot) => !slotGuestCounts[slot] || slotGuestCounts[slot] < MAX_GUESTS_PER_SLOT
    );

    const bookedSlots = allSlots.filter(
      (slot) => slotGuestCounts[slot] >= MAX_GUESTS_PER_SLOT
    );

    res.status(200).json({
      availableSlots,
      bookedSlots,
    });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    res.status(500).json({
      message: 'Error fetching available time slots',
      error: error.message || error,
    });
  }
};

const getBookingsInRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required.' });
    }

    const bookings = await Booking.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message || error });
  }
};

module.exports = {
  createBooking,
  getBookings,
  deleteBooking,
  deleteBookingByUser,
  getAvailableTimeSlots,
  getBookingsByUser,
  getBookingsInRange,
};
