import sendEmail from "../utils/sendEmail.js";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, travelers, tripTitle, price, startDate } = req.body;

    const bookingCode = `TM-${uuidv4().slice(0, 8).toUpperCase()}`;

    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        userId: req.user.id,
        name,
        email,
        phone,
        travelers,
        tripTitle,
        price,
        startDate: startDate ? new Date(startDate) : null,
      },
    });

    try {
      await sendEmail.bookingReceivedEmail(booking);
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getBookingByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const booking = await prisma.booking.findUnique({
      where: {
        bookingCode: code,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};