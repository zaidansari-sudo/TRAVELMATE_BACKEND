import { PrismaClient } from "@prisma/client";
import sendEmail from "../utils/sendEmail.js";

const prisma = new PrismaClient();

// ================= GET BOOKINGS =================
export const getBookings = async (req, res) => {
  try {
    const { status } = req.query;

    const bookings = await prisma.booking.findMany({
      where: status ? { status } : {},
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
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

// ================= UPDATE BOOKING STATUS =================
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = Number(req.params.id);

    if (!["Pending", "Confirmed", "Cancelled", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    if (status === "Confirmed") {
      await sendEmail.confirmationEmail(booking);
    }

    if (status === "Cancelled") {
      await sendEmail.cancellationEmail(booking);
    }

    res.json({ message: "Status updated", booking });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};