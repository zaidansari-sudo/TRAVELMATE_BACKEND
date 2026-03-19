import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import sendEmail from "./sendEmail.js";

const prisma = new PrismaClient();

export const startBookingCron = () => {

  cron.schedule("0 0 * * *", async () => {
    const today = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
);

    // Get expired pending bookings
    const expiredPending = await prisma.booking.findMany({
      where: {
        status: "Pending",
        startDate: { lt: today },
      },
    });

    for (const booking of expiredPending) {

  if (booking.status !== "Pending") continue;
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "Cancelled" },
      });

      try {
  await sendEmail.cancellationEmail(booking);
} catch (err) {
  console.log("Email failed:", err.message);
}
    }

    // Move confirmed expired to completed
    await prisma.booking.updateMany({
      where: {
        status: "Confirmed",
        startDate: { lt: today },
      },
      data: { status: "Completed" },
    });

    console.log("Daily automation done");
  });

};