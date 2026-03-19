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

    // 🔍 Get existing booking
    const existing = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🚫 If same status, skip update
    if (existing.status === status) {
      return res.json({
        message: "Status already set",
        booking: existing,
      });
    }

    // ✅ Update booking
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // 📧 Send emails safely
    try {
      if (existing.status !== "Confirmed" && status === "Confirmed") {
        await sendEmail.confirmationEmail(booking);
      }

      if (existing.status !== "Cancelled" && status === "Cancelled") {
        await sendEmail.cancellationEmail(booking);
      }
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    // ✅ Response (IMPORTANT)
    res.json({
      message: "Status updated successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};