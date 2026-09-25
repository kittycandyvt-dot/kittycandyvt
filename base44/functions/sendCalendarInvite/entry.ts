import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, email, preferredDate } = body || {};

    if (!email || !preferredDate) {
      return Response.json(
        { error: "Email and preferredDate are required" },
        { status: 400 }
      );
    }

    const { accessToken } =
      await base44.asServiceRole.connectors.getConnection("googlecalendar");

    /*
     * INTERVIEW TIME
     *
     * Start: 10:00 PM America/Toronto
     * End:   12:00 AM the following day
     * Duration: 2 hours
     *
     * IMPORTANT:
     * We send the local Toronto time directly to Google Calendar.
     * We do NOT use toISOString(), because that converts the time
     * to UTC and was causing 10 PM to appear as 6 PM.
     */

    // Validate the expected YYYY-MM-DD format.
    const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(preferredDate);

    if (!dateMatch) {
      return Response.json(
        {
          error:
            "Invalid preferredDate format. Expected YYYY-MM-DD."
        },
        { status: 400 }
      );
    }

    const year = Number(dateMatch[1]);
    const month = Number(dateMatch[2]);
    const day = Number(dateMatch[3]);

    // Calculate the next calendar day for the midnight end time.
    const nextDay = new Date(Date.UTC(year, month - 1, day + 1));

    const endDate =
      `${nextDay.getUTCFullYear()}-` +
      `${String(nextDay.getUTCMonth() + 1).padStart(2, "0")}-` +
      `${String(nextDay.getUTCDate()).padStart(2, "0")}`;

    /*
     * Google Calendar event.
     *
     * These are intentionally LOCAL times.
     * Google Calendar uses America/Toronto to determine whether
     * the date is currently EST or EDT.
     */

    const eventPayload = {
      summary: `🎤 Interview with ${name || "Guest"}`,

      description:
        "Your interview session has been booked. We can't wait to chat with you! 💕",

      start: {
        dateTime: `${preferredDate}T22:00:00`,
        timeZone: "America/Toronto",
      },

      end: {
        dateTime: `${endDate}T00:00:00`,
        timeZone: "America/Toronto",
      },

      attendees: [
        {
          email,
        },
      ],

      guestsCanModify: false,
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
    };

    /*
     * Create the Google Calendar event.
     */

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
      console.error("Google Calendar error:", data);

      return Response.json(
        {
          error:
            data.error?.message ||
            "Failed to create calendar event",
        },
        { status: 502 }
      );
    }

    /*
     * Confirmation email.
     *
     * Format the selected date without converting it through UTC.
     */

    const displayDate = new Date(`${preferredDate}T12:00:00`);

    const eventDate = displayDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Toronto",
    });

    // The interview is always at 10 PM.
    const eventTime = "10:00 PM";

    /*
     * Confirmation email HTML.
     */

    const confirmHtml = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #fff5fa; border-radius: 16px; overflow: hidden; border: 1px solid #f9a8c5;">

        <div style="background: linear-gradient(90deg, #ec4899, #d946ef); padding: 28px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">
            You're Booked! 💕🎤
          </h1>
        </div>

        <div style="padding: 28px; color: #25161c; line-height: 1.7;">

          <p style="margin: 0 0 16px;">
            Hi ${name || "there"},
          </p>

          <p style="margin: 0 0 16px;">
            Thank you for signing up for a VTuber interview with KittyCandyVT!
            I'm so excited to chat with you. ✨
          </p>

          <div style="background: #fff; border: 1px solid #f9a8c5; border-radius: 12px; padding: 16px; margin: 16px 0;">

            <p style="margin: 0 0 8px; font-size: 14px; color: #b01a58; font-weight: 600;">
              📅 Interview Details
            </p>

            <p style="margin: 0 0 6px;">
              <strong>Date:</strong> ${eventDate}
            </p>

            <p style="margin: 0 0 6px;">
              <strong>Time:</strong> ${eventTime} Eastern Time
            </p>

            <p style="margin: 0 0 6px;">
              <strong>Duration:</strong> 2 hours
            </p>

          </div>

          <p style="margin: 0 0 16px;">
            A calendar invite has been sent to your email — please accept it
            to add the event to your own calendar. You'll also receive a
            reminder before we go live.
          </p>

          ${
            data.htmlLink
              ? `
                <p style="margin: 0 0 16px;">
                  <a
                    href="${data.htmlLink}"
                    style="display: inline-block; background: linear-gradient(90deg, #ec4899, #d946ef); color: #fff; padding: 10px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;"
                  >
                    View in Google Calendar
                  </a>
                </p>
              `
              : ""
          }

          <hr style="border: none; border-top: 1px solid #f9a8c5; margin: 20px 0;" />

          <p style="margin: 0; font-size: 13px; color: #b01a58;">
            Can't make it? Just reply to this email and we'll reschedule.
            See you soon! 💖
          </p>

        </div>
      </div>
    `;

    /*
     * Send confirmation email.
     */

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject:
        `🎤 Interview Confirmed — ${eventDate} at ${eventTime} Eastern Time`,
      html: confirmHtml,
    });

    /*
     * Return success.
     */

    return Response.json({
      success: true,
      eventId: data.id,
      htmlLink: data.htmlLink,
    });

  } catch (error) {
    console.error("Interview booking error:", error);

    return Response.json(
      {
        error: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}