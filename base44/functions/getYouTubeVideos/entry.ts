import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

const CHANNEL_URL = "https://www.youtube.com/@KittyCandyVT";

function extractChannelId(html) {
  const match = html.match(/"channelId":"(UC[\w-]{22})"/);
  if (match) return match[1];
  const match2 = html.match(/"externalId":"(UC[\w-]{22})"/);
  if (match2) return match2[1];
  const match3 = html.match(/channel\/(UC[\w-]{22})/);
  if (match3) return match3[1];
  return null;
}

function extractText(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return "";
  return match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function extractVideos(xml) {
  const entries = xml.split("<entry>").slice(1);
  return entries.slice(0, 6).map((entry) => {
    const videoId = (entry.match(/<yt:videoId>([\s\S]*?)<\/yt:videoId>/) || [])[1]?.trim() || "";
    const title = extractText(entry, "title");
    const published = (entry.match(/<published>([\s\S]*?)<\/published>/) || [])[1]?.trim() || "";
    const thumbnail = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    return { videoId, title, published, thumbnail, url: `https://www.youtube.com/watch?v=${videoId}` };
  });
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Step 1: Resolve channel ID from handle
    const pageRes = await fetch(CHANNEL_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const pageHtml = await pageRes.text();
    const channelId = extractChannelId(pageHtml);

    if (!channelId) {
      return Response.json({ error: 'Could not resolve channel ID' }, { status: 500 });
    }

    // Step 2: Fetch RSS feed
    const rssRes = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const rssXml = await rssRes.text();
    const videos = extractVideos(rssXml);

    return Response.json({ videos, channelId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}