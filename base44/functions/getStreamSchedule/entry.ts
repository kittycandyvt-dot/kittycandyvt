import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`
      + `?timeMin=${encodeURIComponent(now.toISOString())}`
      + `&timeMax=${encodeURIComponent(weekFromNow.toISOString())}`
      + `&singleEvents=true`
      + `&orderBy=startTime`
      + `&maxResults=50`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      const errBody = await res.text();
      return Response.json({ error: 'Google Calendar API error', details: errBody }, { status: 502 });
    }

    const data = await res.json();
    const events = (data.items || []).map((e) => {
      const start = e.start?.dateTime || e.start?.date;
      const end = e.end?.dateTime || e.end?.date;
      return {
        id: e.id,
        title: e.summary || 'Untitled Event',
        start,
        end,
      };
    });

    return Response.json({ events });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}