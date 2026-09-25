import { createClientFromRequest } from "npm:@base44/sdk@0.8.49";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      name,
      email,
      selectedSlot,
    } = body || {};

    if (!email || !selectedSlot) {
      return Response.json(
        {
          error:
            "Email and selectedSlot are required",
        },
        { status: 400 }
      );
    }

    /*
     * The frontend stores selectedSlot as an ISO timestamp.
     *
     * Example:
     * 2026-11-02T03:00:00.000Z
     *
     * We convert that into the correct local
     * America/Toronto date and time.
     */

    const slot = new Date(selectedSlot);

    if (Number.isNaN(slot.getTime())) {
      return Response.json(
        {
          error: "Invalid selectedSlot.",
        },
        { status: 400 }
      );
    }

    /*
     * Get the local Toronto date/time components.
     */

    const formatter = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "America/Toronto",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    );

    const parts = formatter.formatToParts(slot);

    const getPart = (type) =>
      parts.find((part) => part.type === type)?.value;

    const year = getPart("year");
    const month = getPart("month");
    const day = getPart("day");
    const hour = getPart("hour");
    const minute = getPart("minute");

    const localDate =
      `${year}-${month}-${day}`;

    /*
     * The interview is 2 hours long.
     *
     * Calculate the ending time using the actual
     * selected slot.
     */

    const endSlot = new Date(
      slot.getTime() + 2 * 60 * 60 * 1000
    );

    const endParts = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "America/Toronto",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    ).formatToParts(endSlot);

    const getEndPart = (type) =>
      endParts.find(
        (part) => part.type === type
      )?.value;

    const endDate =
      `${getEndPart("year")}-${getEndPart("month")}-${getEndPart("day")}`;

    const endHour = getEndPart("hour");
    const endMinute = getEndPart("minute");

    /*
     * Connect to Google Calendar.
     */

    const { accessToken } =
      await base44.asServiceRole.connectors.getConnection(
        "googlecalendar"
      );

    /*
     * Create the calendar event.
     */

    const eventPayload = {
      summary:
        `🎤 Interview with ${name || "Guest"}`,

      description:
        "Your interview session has been booked with KittyCandyVT! 💕",

      start: {
        dateTime:
          `${localDate}T${hour}:${minute}:00`,
        timeZone: "America/Toronto",
      },

      end: {
        dateTime:
          `${endDate}T${endHour}:${endMinute}:00`,
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

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(eventPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Google Calendar error:",
        data
      );

      return Response.json(
        {
          error:
            data.error?.message ||
            "Failed to create calendar event.",
        },
        { status: 502 }
      );
    }

    /*
     * Format the date for the confirmation email.
     */

    const displayDate =
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone: "America/Toronto",
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      ).format(slot);

    const displayTime =
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone: "America/Toronto",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      ).format(slot);

    /*
     * Confirmation email.
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
              <strong>Date:</strong> ${displayDate}
            </p>

            <p style="margin: 0 0 6px;">
              <strong>Time:</strong> ${displayTime} Eastern Time
            </p>

            <p style="margin: 0 0 6px;">
              <strong>Duration:</strong> 2 hours
            </p>

          </div>

          <p style="margin: 0 0 16px;">
            A calendar invite has been sent to your email.
            Please accept it to add the interview to your calendar.
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
        `🎤 Interview Confirmed — ${displayDate} at ${displayTime} Eastern Time`,

      html: confirmHtml,
    });

    return Response.json({
      success: true,
      eventId: data.id,
      htmlLink: data.htmlLink,
    });

  } catch (error) {
    console.error(
      "sendCalendarInvite error:",
      error
    );

    return Response.json(
      {
        error:
          error?.message ||
          "Something went wrong creating the calendar invite.",
      },
      {
        status: 500,
      }
    );
  }
}