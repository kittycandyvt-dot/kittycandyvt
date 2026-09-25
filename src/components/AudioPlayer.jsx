import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export default function AudioPlayer({
  title = "Voice Demo",
  subtitle = "",
  duration = "0:30",
  compact = false,
}) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState("0:00");

  // No real audio file — simulate a player with a timer for demo purposes.
  const toggle = () => {
    setPlaying((p) => !p);
  };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 100 / (30 * 10), 100);
        if (next >= 100) {
          setPlaying(false);
          return 0;
        }
        const secs = Math.round((next / 100) * 30);
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        setCurrent(`${m}:${s.toString().padStart(2, "0")}`);
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-white/70 backdrop-blur-md border border-pink-100 shadow-sm px-4 py-3 ${
        compact ? "" : "w-full"
      }`}
    >
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="grid place-items-center shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white shadow-md hover:scale-105 transition-transform"
      >
        {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        {!compact && (
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="font-semibold text-sm text-plum-900 truncate">{title}</p>
            <span className="text-xs text-pink-400 tabular-nums">{current} / {duration}</span>
          </div>
        )}
        {compact && <p className="font-semibold text-sm text-plum-900 truncate">{title}</p>}
        {!compact && subtitle && <p className="text-xs text-plum-400 truncate">{subtitle}</p>}
        <div
          className="mt-1 h-2 rounded-full bg-pink-100 overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setProgress(((e.clientX - rect.left) / rect.width) * 100);
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-fuchsia-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}