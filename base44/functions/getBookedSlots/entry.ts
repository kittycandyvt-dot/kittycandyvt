import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const now = new Date();
    const threeMonthsOut = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`
      + `?timeMin=${encodeURIComponent(now.toISOString())}`
      + `&timeMax=${encodeURIComponent(threeMonthsOut.toISOString())}`
      + `&singleEvents=true`
      + `&orderBy=startTime`
      + `&maxResults=250`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      const errBody = await res.text();
      return Response.json({ error: 'Google Calendar API error', details: errBody }, { status: 502 });
    }

    const data = await res.json();

    // Return start ISO strings for all events — the SlotPicker matches against
    // its own generated 10 PM slot ISO strings to mark them as booked.
    const bookedSlots = (data.items || [])
      .map((e) => e.start?.dateTime || e.start?.date)
      .filter(Boolean);

    return Response.json({ bookedSlots });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}