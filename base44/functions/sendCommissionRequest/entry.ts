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
    const flags = [];
    if (f.commercial) flags.push("Commercial Usage");
    if (f.nsfw) flags.push("NSFW (18+)");

    const subject = `Commission Request — ${f.projectName || f.name || "New"}`;
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffe0ef;border-radius:24px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#e64a85;color:#000;padding:20px 28px;">
          <h2 style="margin:0;font-size:22px;">New Commission Request</h2>
          <p style="margin:4px 0 0;font-size:14px;">From the KittyCandyVT website</p>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#ffffff;">
          ${row("Name", f.name)}
          ${row("Email", f.email)}
          ${row("Discord", f.discord)}
          ${row("Project Name", f.projectName)}
          ${row("Project Type", f.projectType)}
          ${row("Character Name", f.characterName)}
          ${row("Desired Voice", f.desiredVoice)}
          ${row("Tone", f.tone)}
          ${row("Emotion", f.emotion)}
          ${row("Deadline", f.deadline)}
          ${row("Commercial / NSFW", flags.join(", "))}
        </table>
        <div style="background:#ffffff;padding:0 20px 20px;">
          <p style="font-weight:600;color:#b01a58;margin:12px 0 4px;">Script</p>
          <p style="white-space:pre-wrap;color:#25161c;background:#fff9fb;border-radius:12px;padding:12px;">${escapeHtml(f.script)}</p>
          ${f.pronunciation ? `<p style="font-weight:600;color:#b01a58;margin:12px 0 4px;">Pronunciation Notes</p><p style="white-space:pre-wrap;color:#25161c;background:#fff9fb;border-radius:12px;padding:12px;">${escapeHtml(f.pronunciation)}</p>` : ""}
          ${f.additional ? `<p style="font-weight:600;color:#b01a58;margin:12px 0 4px;">Additional Information</p><p style="white-space:pre-wrap;color:#25161c;background:#fff9fb;border-radius:12px;padding:12px;">${escapeHtml(f.additional)}</p>` : ""}
          ${f.fileUrls?.length ? `<p style="font-weight:600;color:#b01a58;margin:12px 0 4px;">Attached Files</p><ul style="color:#25161c;">${f.fileUrls.map((u: string) => `<li><a href="${escapeHtml(u)}">${escapeHtml(u)}</a></li>`).join("")}</ul>` : ""}
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