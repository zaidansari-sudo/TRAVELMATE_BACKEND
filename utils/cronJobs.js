import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import sendEmail from "./sendEmail.js";

const prisma = new PrismaClient();

export const startBookingCron = () => {

  cron.schedule("0 0 * * *", async () => {
    const today = new Date();

    // Get expired pending bookings
    const expiredPending = await prisma.booking.findMany({
      where: {
        status: "Pending",
        startDate: { lt: today },
      },
    });

    for (const booking of expiredPending) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "Cancelled" },
      });

      await sendEmail.cancellationEmail(booking);
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