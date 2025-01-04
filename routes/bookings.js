import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { date, time } = req.body;

   if (!date || !time || !req.body.guests || !req.body.name || !req.body.contact) {
      return res.status(400).send("Missing required fields.");
    }

    const existing = await Booking.findOne({ date, time });
    if (existing) return res.status(400).send("Slot already booked");

    const booking = new Booking(req.body);
    await booking.save();

    res.status(201).send(booking);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).send("Internal server error.");
  }
});

router.get("/", async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).send("Date query parameter is required.");
  }

  try {
    const bookings = await Booking.find({ date });
    res.send(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).send("Failed to fetch bookings.");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Booking.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).send("Failed to delete booking.");
  }
});

export default router;