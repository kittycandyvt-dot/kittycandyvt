import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const SETUP_URL = 'https://kittycandyvt.ca/setup-account';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const email = (body?.email || '').toLowerCase().trim();
    if (!email || !email.includes('@')) {
      return Response.json({ error: 'A valid email is required' }, { status: 400 });
    }

    // Create purchase if it doesn't exist
    const existing = await base44.asServiceRole.entities.Purchase.filter({ customerEmail: email });
    if (existing.length === 0) {
      await base44.asServiceRole.entities.Purchase.create({
        customerEmail: email,
        accessStatus: 'active',
        productName: 'VTuber Planner',
        purchaseDate: new Date().toISOString()
      });
    } else {
      // Ensure access is active
      const rec = existing[0];
      if (rec.accessStatus !== 'active') {
        await base44.asServiceRole.entities.Purchase.update(rec.id, { accessStatus: 'active' });
      }
    }

    // Invite the user (creates account if needed)
    try {
      await base44.users.inviteUser(email, 'user');
    } catch {
      // User may already exist — that's fine
    }

    // Send custom invitation email with setup link
    const setupLink = `${SETUP_URL}?email=${encodeURIComponent(email)}`;
    const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#ffe0ef;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffe0ef;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(236,72,153,0.12);">
<tr><td style="background:#e64a85;padding:24px 40px;text-align:center;">
<img src="https://media.base44.com/images/public/6ab5f8664d2ba33c8d38d474/08fe577ae_logo.jpg" alt="KittyCandyVT" style="height:40px;border-radius:8px;"/>
</td></tr>
<tr><td style="padding:40px;">
<h1 style="margin:0 0 12px;color:#25161c;font-size:24px;font-weight:700;">Your Planner Access is Ready!</h1>
<p style="color:#d12a6e;font-size:15px;line-height:1.6;margin:0 0 24px;">You now have access to the KittyCandyVT VTuber Planner. Click the button below to set your password and start planning.</p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
<tr><td style="background:#e64a85;border-radius:24px;">
<a href="${setupLink}" style="display:inline-block;padding:14px 36px;color:#000000;font-weight:700;text-decoration:none;font-size:16px;">Set Up My Password</a>
</td></tr>
</table>
<p style="color:#25161c;font-size:14px;line-height:1.6;margin:0;">If the button doesn't work, copy and paste this link into your browser:</p>
<p style="color:#e64a85;font-size:13px;word-break:break-all;margin:8px 0 0;">${setupLink}</p>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
<p style="color:#d12a6e;font-size:12px;margin:0;">If you didn't expect this email, you can safely ignore it.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: email,
      subject: 'Your VTuber Planner Access is Ready!',
      html: html
    });

    return Response.json({ success: true, email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}