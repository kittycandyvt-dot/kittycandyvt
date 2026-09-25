import { createClientFromRequest } from "npm:@base44/sdk@0.8.49";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    // Get pending bookings.
    const pendingBookings =
      await base44.asServiceRole.entities.InterviewSignup.filter({
        status: "pending",
      });

    // Get confirmed bookings.
    const confirmedBookings =
      await base44.asServiceRole.entities.InterviewSignup.filter({
        status: "confirmed",
      });

    const bookings = [
      ...pendingBookings,
      ...confirmedBookings,
    ];

    // Only use the exact selectedSlot.
    //
    // IMPORTANT:
    // Do NOT fall back to preferredDate here.
    // preferredDate only contains YYYY-MM-DD and would
    // incorrectly block every slot on that date.
    const bookedSlots = bookings
      .map((booking) => booking.selectedSlot)
      .filter(
        (slot) =>
          typeof slot === "string" &&
          slot.includes("T")
      );

    // Remove duplicates just in case.
    const uniqueBookedSlots = [
      ...new Set(bookedSlots),
    ];

    return Response.json({
      bookedSlots: uniqueBookedSlots,
    });

  } catch (error) {
    console.error(
      "getBookedSlots error:",
      error
    );

    return Response.json(
      {
        bookedSlots: [],
        error:
          "Unable to load booked interview slots.",
      },
      {
        status: 500,
      }
    );
  }
}