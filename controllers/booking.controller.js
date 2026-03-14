import sendEmail from "../utils/sendEmail.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, travelers, tripTitle, price, startDate } = req.body;

    const year = new Date().getFullYear();

    // Count bookings this year
    const count = await prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });

    const bookingCode = `TM-${year}-${String(count + 1).padStart(4, "0")}`;

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

    await sendEmail.bookingReceivedEmail(booking);

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