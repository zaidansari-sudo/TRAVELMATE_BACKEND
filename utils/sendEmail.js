import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const send = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"TravelMate 🧭" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// ================= EMAILS =================

const bookingReceivedEmail = async (booking) => {
  await send(
    booking.email,
    "Booking Received – TravelMate",
    `
    <h2>Hi ${booking.name},</h2>
    <p>Your booking has been received successfully.</p>
    <p><strong>Booking ID:</strong> ${booking.bookingCode}</p>
    <p><strong>Trip:</strong> ${booking.tripTitle}</p>
    <p>We will confirm after payment verification.</p>
    <br/>
    <strong>TravelMate Team</strong>
    `
  );
};

const confirmationEmail = async (booking) => {
  await send(
    booking.email,
    "🎉 Booking Confirmed – TravelMate",
    `
    <h2>Hi ${booking.name},</h2>
    <p>Your booking is confirmed.</p>
    <p><strong>Booking ID:</strong> ${booking.bookingCode}</p>
    <p><strong>Date:</strong> ${new Date(booking.startDate).toDateString()}</p>
    <br/>
    <strong>TravelMate Team</strong>
    `
  );
};

const cancellationEmail = async (booking) => {
  await send(
    booking.email,
    "Booking Cancelled – TravelMate",
    `
    <h2>Hi ${booking.name},</h2>
    <p>Your booking (${booking.bookingCode}) has been cancelled.</p>
    <br/>
    <strong>TravelMate Team</strong>
    `
  );
};

export default {
  bookingReceivedEmail,
  confirmationEmail,
  cancellationEmail,
};