import { createClientFromRequest } from "npm:@base44/sdk@0.8.49";

const NOTIFICATION_EMAIL = "kittycandyvt@gmail.com";

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();

    const {
      name,
      email,
      handle,
      platform,
      preferredDate,
      selectedSlot,
      details,
    } = body || {};

    if (!name || !email || !selectedSlot) {
      return Response.json(
        {
          error:
            "Name, email, and selected interview slot are required",
        },
        { status: 400 }
      );
    }

    // Convert the exact ISO slot into a readable date/time.
    const slotDate = new Date(selectedSlot);

    const formattedSlot = slotDate.toLocaleString(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeHandle = escapeHtml(handle);
    const safePlatform = escapeHtml(platform);
    const safePreferredDate = escapeHtml(preferredDate);
    const safeDetails = escapeHtml(details);
    const safeSlot = escapeHtml(formattedSlot);

    const subject =
      `🎤 New Interview Sign-Up from ${safeName}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #fff5fa; border-radius: 16px; overflow: hidden; border: 1px solid #f9a8c5;">

        <div style="background: linear-gradient(90deg, #ec4899, #d946ef); padding: 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">
            New Interview Request! 💕
          </h1>
        </div>

        <div style="padding: 24px; color: #25161c; line-height: 1.6;">

          <p style="margin: 0 0 16px;">
            <strong>Name:</strong> ${safeName}
          </p>

          <p style="margin: 0 0 16px;">
            <strong>Email:</strong> ${safeEmail}
          </p>

          ${
            safeHandle
              ? `
                <p style="margin: 0 0 16px;">
                  <strong>Handle:</strong> ${safeHandle}
                </p>
              `
              : ""
          }

          ${
            safePlatform
              ? `
                <p style="margin: 0 0 16px;">
                  <strong>Platform:</strong> ${safePlatform}
                </p>
              `
              : ""
          }

          <p style="margin: 0 0 16px;">
            <strong>Interview Slot:</strong><br/>
            ${safeSlot}
          </p>

          ${
            safePreferredDate
              ? `
                <p style="margin: 0 0 16px;">
                  <strong>Interview Date:</strong> ${safePreferredDate}
                </p>
              `
              : ""
          }

          ${
            safeDetails
              ? `
                <p style="margin: 0 0 16px;">
                  <strong>Details:</strong><br/>
                  ${safeDetails}
                </p>
              `
              : ""
          }

          <hr style="border: none; border-top: 1px solid #f9a8c5; margin: 20px 0;" />

          <p style="margin: 0; font-size: 13px; color: #b01a58;">
            A new interview sign-up just came in.
            Head to your dashboard to confirm or decline.
          </p>

        </div>
      </div>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: NOTIFICATION_EMAIL,
      subject,
      html,
    });

    return Response.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "sendInterviewNotification error:",
      error
    );

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}