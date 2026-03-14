import express from "express";
import { signup, login, getMe } from "../controllers/auth.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// ================= AUTH ROUTES =================

// Register
router.post("/signup", signup);

// Login
router.post("/login", login);

// Get logged-in user
router.get("/me", protect, getMe);

export default router;