import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  }
});

export default mongoose.model("Booking", BookingSchema);
