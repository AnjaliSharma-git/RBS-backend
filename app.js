const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();
app.use(cors({
    origin: 'https://restaurant-booking-system-anjali.netlify.app/', 
  }));
app.use(bodyParser.json());
app.use('/api/bookings', bookingRoutes);

module.exports = app;
