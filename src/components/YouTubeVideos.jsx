import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/SectionHeading";
import { Youtube, Play } from "lucide-react";

export default function YouTubeVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchVideos = async () => {
      try {
        const res = await base44.functions.invoke("getYouTubeVideos", {});
        if (cancelled) return;
        if (res.data?.videos?.length) {
          setVideos(res.data.videos);
        }
      } catch {
        // silent fail — section just won't show
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchVideos();
    return () => { cancelled = true; };
  }, []);

  if (!loading && videos.length === 0) return null;

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="YouTube"
          title="Latest Videos 🎬"
          subtitle="Catch my newest uploads fresh from YouTube"
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-video bg-pink-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-pink-200" />
                  <div className="h-3 w-1/2 rounded bg-pink-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <a
                key={v.videoId}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden bg-plum-900">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="grid place-items-center w-14 h-14 rounded-full bg-red-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={24} className="fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 grid place-items-center w-8 h-8 rounded-full bg-red-600 text-white shadow">
                    <Youtube size={16} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-plum-900 line-clamp-2 text-sm leading-snug">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs text-plum-400 font-medium">
                    {new Date(v.published).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}