import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const RECIPIENT = "kittycandyvt@gmail.com";

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr><td style="padding:8px 12px;font-weight:600;color:#b01a58;width:40%;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#25161c;vertical-align:top;">${escapeHtml(value)}</td></tr>`;
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const f = body?.fields || {};
    const fileUrls: string[] = Array.isArray(f.fileUrls) ? f.fileUrls : [];

    const stars = "★".repeat(Math.max(0, Math.min(5, Number(f.rating) || 0))) + "☆".repeat(5 - Math.max(0, Math.min(5, Number(f.rating) || 0)));
    const subject = `New Review — ${f.clientName || "Anonymous"}`;

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffe0ef;border-radius:24px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#e64a85;color:#000;padding:20px 28px;">
          <h2 style="margin:0;font-size:22px;">New Client Review</h2>
          <p style="margin:4px 0 0;font-size:14px;">Submitted from the KittyCandyVT website</p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#ffffff;">
          ${row("Client Name", f.clientName)}
          ${row("Social Handle", f.clientHandle)}
          ${row("Project Type", f.projectType)}
          ${row("Rating", stars)}
        </table>
        <div style="background:#ffffff;padding:0 20px 20px;">
          <p style="font-weight:600;color:#b01a58;margin:12px 0 4px;">Review</p>
          <p style="white-space:pre-wrap;color:#25161c;background:#fff9fb;border-radius:12px;padding:12px;">${escapeHtml(f.reviewText)}</p>
          ${fileUrls.length ? `<p style="font-weight:600;color:#b01a58;margin:16px 0 4px;">Attached Photos / Videos</p><ul style="color:#25161c;list-style:none;padding:0;">${fileUrls.map((u: string) => `<li style="margin:6px 0;"><a href="${escapeHtml(u)}" style="color:#e64a85;word-break:break-all;">${escapeHtml(u)}</a></li>`).join("")}</ul><p style="font-size:12px;color:#d12a6e;margin-top:8px;">Note: These links expire in 7 days. Download the files to keep them.</p>` : ""}
        </div>
      </div>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: RECIPIENT,
      subject,
      html,
    });

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}