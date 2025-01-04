import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookings.js";
import connectDB from "./config/db.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({
  origin: 'https://ticket-booking-frontend-2qjw.vercel.app',
}));

connectDB();

app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));