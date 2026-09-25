import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, email, preferredDate } = body || {};

    if (!email || !preferredDate) {
      return Response.json({ error: "Email and preferredDate are required" }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("googlecalendar");

    // Build the event time: preferredDate at 10:00 PM, 1 hour duration.
    const start = new Date(preferredDate + "T22:00:00");
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const eventPayload = {
      summary: `🎤 Interview with ${name || "Guest"}`,
      description: "Your interview session has been booked. We can't wait to chat with you! 💕",
      start: {
        dateTime: start.toISOString(),
        timeZone: "America/Toronto",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "America/Toronto",
      },
      attendees: [{ email }],
      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data.error?.message || "Failed to create calendar event" }, { status: 502 });
    }

    return Response.json({ success: true, eventId: data.id, htmlLink: data.htmlLink });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}