import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { site } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import { Play } from "lucide-react";

const fallbackSchedule = [
  { day: "Monday", icon: "🌙" },
  { day: "Wednesday", icon: "🎤" },
  { day: "Friday", icon: "🎉" },
  { day: "Saturday", icon: "✨" },
];

function formatEventDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    + " · "
    + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Toronto" })
    + " EST";
}

export default function StreamSchedule() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchSchedule = async () => {
      try {
        const res = await base44.functions.invoke("getStreamSchedule", {});
        if (cancelled) return;
        if (res.data?.events?.length) {
          setEvents(res.data.events);
          setLive(true);
        }
      } catch {
        // fall back to default schedule
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSchedule();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-16 px-4 md:px-6 bg-pink-50/50">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="Stream Schedule"
          title="Catch me live ✨"
          subtitle={live ? "Pulled live from my Google Calendar" : "All times in EST (10 PM)"}
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center animate-pulse">
                <div className="h-8 w-8 mx-auto mb-2 rounded-full bg-pink-200" />
                <div className="h-4 w-20 mx-auto rounded bg-pink-200" />
                <div className="h-3 w-16 mx-auto mt-2 rounded bg-pink-100" />
              </div>
            ))}
          </div>
        ) : live ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((e) => (
              <div key={e.id} className="glass rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-400 text-white text-xl shrink-0">📺</div>
                <div className="min-w-0">
                  <h3 className="font-bold text-plum-900 truncate">{e.title}</h3>
                  <p className="text-sm font-semibold text-pink-500 mt-0.5">{formatEventDate(e.start)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fallbackSchedule.map((s) => (
              <div key={s.day} className="glass rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">{s.icon}</div>
                <h3 className="font-bold text-plum-900">{s.day}</h3>
                <p className="text-sm font-semibold text-pink-500 mt-1">10:00 PM EST</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a href={site.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform">
            <Play size={18} /> Follow on {site.livePlatform}
          </a>
        </div>
      </div>
    </section>
  );
}