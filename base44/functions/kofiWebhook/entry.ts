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

    // Optional verification token check
    const verificationToken = secrets.get('KOFI_VERIFICATION_TOKEN');
    if (verificationToken) {
      const providedToken = payload.verification_token || payload.verificationToken;
      if (providedToken !== verificationToken) {
        return Response.json({ error: 'Invalid verification token' }, { status: 403 });
      }
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

    // Create entitlement record
    const purchase = await base44.asServiceRole.entities.Purchase.create({
      kofiPurchaseId: messageId || '',
      customerEmail: customerEmail.toLowerCase(),
      productId: productId || '',
      productName: productName || 'VTuber Planner',
      purchaseDate: purchaseDate,
      accessStatus: type === 'refund' || type === 'cancelled' ? 'revoked' : 'active'
    });

    return Response.json({ status: 'created', purchaseId: purchase.id, access: purchase.accessStatus });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}