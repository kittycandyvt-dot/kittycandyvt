import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';

export default async function(req) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let payload;
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      const rawData = params.get('data');
      if (!rawData) return Response.json({ error: 'Missing data field' }, { status: 400 });
      payload = JSON.parse(rawData);
    } else {
      payload = await req.json();
    }

    // Mandatory verification token check — reject if secret is missing or mismatched
    const verificationToken = secrets.get('KOFI_VERIFICATION_TOKEN');
    if (!verificationToken) {
      return Response.json({ error: 'Webhook verification not configured.' }, { status: 403 });
    }
    const providedToken = payload.verification_token || payload.verificationToken;
    if (providedToken !== verificationToken) {
      return Response.json({ error: 'Invalid verification token' }, { status: 403 });
    }

    const type = payload.type;
    const messageId = payload.message_id || payload.kofiPurchaseId;
    const message = payload.message || payload;

    const customerEmail = message.email || message.buyer_email || payload.email;
    const productId = message.product_id || message.tier_id || payload.product_id;
    const productName = message.product_name || message.tier_name || payload.product_name;
    const purchaseDate = message.timestamp || payload.timestamp || new Date().toISOString();

    if (!customerEmail) {
      return Response.json({ error: 'Missing customer email' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Idempotency: check for existing purchase with same Ko-fi id
    if (messageId) {
      const existing = await base44.asServiceRole.entities.Purchase.filter({
        kofiPurchaseId: messageId
      });
      if (existing && existing.length > 0) {
        return Response.json({ status: 'duplicate', purchaseId: existing[0].id });
      }
    }

    const accessStatus = type === 'refund' || type === 'cancelled' ? 'revoked' : 'active';

    if (accessStatus === 'revoked') {
      // Revoke all existing active purchases for this customer instead of creating a new record
      await base44.asServiceRole.entities.Purchase.updateMany(
        { customerEmail: customerEmail.toLowerCase(), accessStatus: 'active' },
        { $set: { accessStatus: 'revoked' } }
      );

      // Demote any linked user back to regular user role
      try {
        const users = await base44.asServiceRole.entities.User.filter({ email: customerEmail.toLowerCase() });
        if (users && users.length > 0) {
          for (const u of users) {
            if (u.role === 'planner') {
              await base44.asServiceRole.entities.User.update(u.id, { role: 'user' });
            }
          }
        }
      } catch (e) {
        console.error('Failed to demote user role on refund:', e.message);
      }

      return Response.json({ status: 'revoked', access: 'revoked' });
    }

    // Create entitlement record
    const purchase = await base44.asServiceRole.entities.Purchase.create({
      kofiPurchaseId: messageId || '',
      customerEmail: customerEmail.toLowerCase(),
      productId: productId || '',
      productName: productName || 'VTuber Planner',
      purchaseDate: purchaseDate,
      accessStatus
    });

    // Send registration email for active purchases (invite the buyer to create their account)
    if (accessStatus === 'active') {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: customerEmail,
          template_name: 'PlannerPurchaseWelcome',
          variables: {
            product_name: productName || 'VTuber Planner',
            register_url: 'https://kittycandyvt.ca/register',
            support_url: 'https://kittycandyvt.ca/contact'
          }
        });
      } catch (emailError) {
        // Email send failure should not block the webhook response
        console.error('Failed to send purchase email:', emailError.message);
      }
    }

    return Response.json({ status: 'created', purchaseId: purchase.id, access: purchase.accessStatus });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}