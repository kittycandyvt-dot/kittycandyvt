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

    // Build the event time: preferredDate at 10:00 PM Eastern Time.
// Interview duration: 2 hours.

const start = new Date(`${preferredDate}T22:00:00`);
const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
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

    // Send a confirmation email to the interviewee with the calendar invite details.
    const eventDate = start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    const eventTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Toronto" });

    const confirmHtml = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #fff5fa; border-radius: 16px; overflow: hidden; border: 1px solid #f9a8c5;">
        <div style="background: linear-gradient(90deg, #ec4899, #d946ef); padding: 28px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">You're Booked! 💕🎤</h1>
        </div>
        <div style="padding: 28px; color: #25161c; line-height: 1.7;">
          <p style="margin: 0 0 16px;">Hi ${name || "there"},</p>
          <p style="margin: 0 0 16px;">Thank you for signing up for a VTuber interview with KittyCandyVT! I'm so excited to chat with you. ✨</p>
          <div style="background: #fff; border: 1px solid #f9a8c5; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px; font-size: 14px; color: #b01a58; font-weight: 600;">📅 Interview Details</p>
            <p style="margin: 0 0 6px;"><strong>Date:</strong> ${eventDate}</p>
           <p style="margin: 0 0 6px;"><strong>Time:</strong> ${eventTime} Eastern Time</p>
          <p style="margin: 0 0 6px;"><strong>Duration:</strong> 2 hours</p>
          </div>
          <p style="margin: 0 0 16px;">A calendar invite has been sent to your email — please accept it to add the event to your own calendar. You'll also receive a reminder before we go live.</p>
          ${data.htmlLink ? `<p style="margin: 0 0 16px;"><a href="${data.htmlLink}" style="display: inline-block; background: linear-gradient(90deg, #ec4899, #d946ef); color: #fff; padding: 10px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">View in Google Calendar</a></p>` : ""}
          <hr style="border: none; border-top: 1px solid #f9a8c5; margin: 20px 0;" />
          <p style="margin: 0; font-size: 13px; color: #b01a58;">Can't make it? Just reply to this email and we'll reschedule. See you soon! 💖</p>
        </div>
      </div>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: `🎤 Interview Confirmed — ${eventDate} at ${eventTime} Eastern Time`,
      html: confirmHtml,
    });

    return Response.json({ success: true, eventId: data.id, htmlLink: data.htmlLink });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}