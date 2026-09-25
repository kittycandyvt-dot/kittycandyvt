import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

const NOTIFICATION_EMAIL = "kittycandyvt@gmail.com";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, email, handle, platform, preferredDate, details } = body || {};

    if (!name || !email) {
      return Response.json({ error: "Name and email are required" }, { status: 400 });
    }

    const subject = `🎤 New Interview Sign-Up from ${name}`;
    const html = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #fff5fa; border-radius: 16px; overflow: hidden; border: 1px solid #f9a8c5;">
        <div style="background: linear-gradient(90deg, #ec4899, #d946ef); padding: 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 22px;">New Interview Request! 💕</h1>
        </div>
        <div style="padding: 24px; color: #25161c; line-height: 1.6;">
          <p style="margin: 0 0 16px;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 16px;"><strong>Email:</strong> ${email}</p>
          ${handle ? `<p style="margin: 0 0 16px;"><strong>Handle:</strong> ${handle}</p>` : ""}
          ${platform ? `<p style="margin: 0 0 16px;"><strong>Platform:</strong> ${platform}</p>` : ""}
          ${preferredDate ? `<p style="margin: 0 0 16px;"><strong>Preferred Date:</strong> ${preferredDate}</p>` : ""}
          ${details ? `<p style="margin: 0 0 16px;"><strong>Details:</strong><br/>${details}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #f9a8c5; margin: 20px 0;" />
          <p style="margin: 0; font-size: 13px; color: #b01a58;">A new interview sign-up just came in. Head to your dashboard to confirm or decline.</p>
        </div>
      </div>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: NOTIFICATION_EMAIL,
      subject,
      html,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}