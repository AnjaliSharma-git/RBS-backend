const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookingRoutes');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();

// Use environment variable for CORS origin (supports local and production)
const allowedOrigins = ['https://restaurant-booking-system-anjali.netlify.app', 'http://localhost:3000'];  // Add more if needed
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(bodyParser.json());
app.use('/bookings', bookingRoutes);

module.exports = app;
