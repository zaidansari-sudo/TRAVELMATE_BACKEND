import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import bookingRoutes from "./routes/booking.route.js";
import adminRoutes from "./routes/admin.route.js";
import { startBookingCron } from "./utils/cronJobs.js";

dotenv.config();

const app = express();

// ✅ Render + Vercel + localhost
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://travelmate-frontend-teal.vercel.app",
    /\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("TravelMate Backend Running...");
});

// ✅ IMPORTANT for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startBookingCron();