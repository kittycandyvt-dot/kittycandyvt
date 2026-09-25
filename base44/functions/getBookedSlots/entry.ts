import { createClientFromRequest } from "npm:@base44/sdk@0.8.49";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const bookings =
      await base44.asServiceRole.entities.InterviewSignup.filter({
        status: "pending",
      });

    const bookedSlots = bookings
      .map((booking) => {
        return booking.selectedSlot || booking.preferredDate;
      })
      .filter(Boolean);

    return Response.json({
      bookedSlots,
    });

  } catch (error) {
    console.error("getBookedSlots error:", error);

    return Response.json(
      {
        bookedSlots: [],
        error: "Unable to load booked interview slots.",
      },
      {
        status: 500,
      }
    );
  }
}