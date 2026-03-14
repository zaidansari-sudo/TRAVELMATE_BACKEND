import express from "express";
import protect from "../middlewares/auth.middleware.js";
import adminOnly from "../middlewares/admin.middleware.js";
import {
  getBookings,
  updateBookingStatus,
} from "../controllers/admin.controller.js";

const router = express.Router();

// GET BOOKINGS
router.get("/bookings", protect, adminOnly, getBookings);

// UPDATE STATUS
router.put("/bookings/:id", protect, adminOnly, updateBookingStatus);

export default router;