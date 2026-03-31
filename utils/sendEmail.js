import nodemailer from "nodemailer";

const baseTemplate = (content) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    
    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: #0f172a; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">🧭 TravelMate</h1>
        <p style="margin: 5px 0 0;">Your Journey Starts Here</p>
      </div>

      <!-- Body -->
      <div style="padding: 25px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #555;">
        © ${new Date().getFullYear()} TravelMate. All rights reserved.
      </div>

    </div>

  </div>
  `;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const send = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"TravelMate 🧭" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.log("Mail error:", err.message);
  }
};

// ================= EMAILS =================

const bookingReceivedEmail = async (booking) => {
  const content = `
    <h2>Hi ${booking.name},</h2>
    <p>Your booking has been successfully received 🎉</p>

    <p><strong>Booking ID:</strong> ${booking.bookingCode}</p>
    <p><strong>Trip:</strong> ${booking.tripTitle}</p>

    <p style="margin-top: 20px;">
      We will confirm your booking after payment verification.
    </p>
  `;

  await send(
    booking.email,
    "Booking Received – TravelMate",
    baseTemplate(content)   
  );
};

const confirmationEmail = async (booking) => {
  const content = `
    <h2 style="margin-bottom: 10px;">Hi ${booking.name},</h2>

    <p style="color: green; font-weight: bold;">
      🎉 Your booking is confirmed!
    </p>

    <p><strong>Booking ID:</strong> ${booking.bookingCode}</p>
    <p><strong>Trip:</strong> ${booking.tripTitle}</p>
    <p><strong>Date:</strong> ${
      booking.startDate 
        ? new Date(booking.startDate).toDateString() 
        : "To be announced"
    }</p>

    <p style="margin-top: 20px; font-size: 13px; color: #555;">
      Need help? Contact us at support@travelmate.com
    </p>
  `;

  await send(
    booking.email,
    "🎉 Booking Confirmed – TravelMate",
    baseTemplate(content)
  );
};

const cancellationEmail = async (booking) => {
  const content = `
    <h2>Hi ${booking.name},</h2>

    <p style="color: red; font-weight: bold;">
      ❌ Your booking has been cancelled
    </p>

    <p><strong>Booking ID:</strong> ${booking.bookingCode}</p>

    <p>
      This happened because the booking was not confirmed in time.
    </p>

    <br/>
    <strong>TravelMate Team</strong>
  `;

  await send(
    booking.email,
    "Booking Cancelled – TravelMate",
    baseTemplate(content)   
  );
};
export default {
  bookingReceivedEmail,
  confirmationEmail,
  cancellationEmail,
};