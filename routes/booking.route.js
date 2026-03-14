import express from "express";
import { createBooking } from "../controllers/booking.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { getMyBookings } from "../controllers/booking.controller.js";

const router = express.Router();

// routes
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);

export default router;