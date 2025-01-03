const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define the Booking schema
const BookingSchema = new mongoose.Schema({
  date: String,
  time: String,
  guests: Number,
  name: String,
  contact: String,
});

const Booking = mongoose.model("Booking", BookingSchema);

// Create Booking Endpoint
app.post("/api/bookings", async (req, res) => {
  try {
    const { date, time } = req.body;

    // Validate incoming data
    if (!date || !time || !req.body.guests || !req.body.name || !req.body.contact) {
      return res.status(400).send("Missing required fields.");
    }

    // Check if the slot is already booked
    const existing = await Booking.findOne({ date, time });
    if (existing) return res.status(400).send("Slot already booked");

    // Save the booking
    const booking = new Booking(req.body);
    await booking.save();

    res.status(201).send(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).send("Internal server error.");
  }
});

// Get Bookings Endpoint (Fetch booked slots for a specific date)
app.get("/api/bookings", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).send("Date query parameter is required.");
  }

  try {
    // Retrieve all bookings for the specified date
    const bookings = await Booking.find({ date });
    res.send(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send("Failed to fetch bookings.");
  }
});

// Delete Booking Endpoint
app.delete("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Delete booking by ID
    await Booking.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).send("Failed to delete booking.");
  }
});

// Start the server
app.listen(3001, () => console.log("Backend running on port 3001"));
