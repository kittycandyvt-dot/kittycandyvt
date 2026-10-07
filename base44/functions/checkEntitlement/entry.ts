import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ hasAccess: false, reason: 'unauthenticated' }, { status: 401 });

    // Admins always have access
    if (user.role === 'admin') {
      return Response.json({ hasAccess: true, reason: 'admin' });
    }

    // Check for an active purchase matching the user's email
    const purchases = await base44.asServiceRole.entities.Purchase.filter({
      customerEmail: user.email.toLowerCase()
    });

    const active = purchases.find(p => p.accessStatus === 'active');

    if (!active) {
      return Response.json({
        hasAccess: false,
        reason: 'no_purchase',
        message: "We couldn't find an active purchase for this email. Please use the email associated with your purchase or contact support."
      });
    }

    // Link the purchase to this user id if not already linked
    if (!active.userId) {
      await base44.asServiceRole.entities.Purchase.update(active.id, { userId: user.id });
    }

    return Response.json({ hasAccess: true, reason: 'active_purchase', purchaseId: active.id });
  } catch (error) {
    return Response.json({ hasAccess: false, reason: 'error', message: error.message }, { status: 500 });
  }
}