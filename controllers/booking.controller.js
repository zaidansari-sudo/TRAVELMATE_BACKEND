import sendEmail from "../utils/sendEmail.js";

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, travelers, tripTitle, price } = req.body;

    // (Optional) Save booking to DB later

    // 📧 Send confirmation email
    await sendEmail({
      to: email,
      subject: " Booking Confirmed – TravelMate",
      html: `
        <div style="font-family: Arial; line-height:1.6">
          <h2>Hi ${name},</h2>
          <p>Your booking has been successfully received!</p>

          <h3> Trip Details</h3>
          <ul>
            <li><strong>Trip:</strong> ${tripTitle}</li>
            <li><strong>Travelers:</strong> ${travelers}</li>
            <li><strong>Price:</strong> ₹${price}</li>
          </ul>

          <p>Our team will contact you within <strong>24 hours</strong>.</p>

          <br/>
          <p>Happy Travels ✨</p>
          <p><strong>TravelMate Team</strong></p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Booking confirmed and email sent",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
};
