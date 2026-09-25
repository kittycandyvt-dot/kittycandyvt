import React, { useState } from "react";
import { Link } from "react-router-dom";
import { spicyVoiceDemos, spicyIntro } from "@/data/siteData";
import { base44 } from "@/api/base44Client";
import AgeGate from "@/components/AgeGate";
import AudioPlayer from "@/components/AudioPlayer";
import { Flame, ArrowLeft, Lock } from "lucide-react";

const spicyCategories = ["Seductive", "Dominant", "Submissive", "Playful", "Wholesome", "Roleplay"];

export default function SpicyVoiceActing() {
  const [verified, setVerified] = useState(false);
  const [activeCat, setActiveCat] = useState("All");

  if (!verified) {
    return <AgeGate onConfirm={() => setVerified(true)} />;
  }

  const filtered =
    activeCat === "All"
      ? spicyVoiceDemos
      : spicyVoiceDemos.filter((d) => d.type === activeCat);

  return (
    <div className="min-h-screen bg-[#0d0610] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Back link */}
        <Link
          to="/voice-acting"
          className="inline-flex items-center gap-2 text-sm font-medium text-pink-300/80 hover:text-pink-200 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Voice Acting
        </Link>

        {/* Hero */}
        <div className="mb-12 rounded-3xl bg-gradient-to-br from-red-600/20 to-pink-700/20 border border-red-900/30 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 grid place-items-center text-white mb-4">
            <Flame size={30} />
          </div>
          <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-red-400 mb-2">
            18+ NSFW Voice Acting
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            The Spicy Side
          </h1>
          <p className="text-pink-100/70 max-w-xl mx-auto">{spicyIntro}</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {["All", ...spicyCategories].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCat === c
                  ? "text-white bg-gradient-to-r from-red-500 to-pink-600"
                  : "text-pink-200/70 border border-red-900/30 hover:bg-white/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Demo grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {filtered.map((d) => (
            <div
              key={d.title}
              className="rounded-3xl border border-red-900/30 bg-gradient-to-br from-[#1a0a12] to-[#120709] p-5 hover:border-red-700/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
                  {d.category}
                </span>
                <span className="text-xs text-pink-300/50">{d.duration}</span>
              </div>
              <h3 className="font-bold text-white mb-1">{d.title}</h3>
              <p className="text-sm text-pink-200/50 mb-3">{d.type} voice</p>
              <AudioPlayer title={d.title} subtitle={`${d.type} · ${d.category}`} duration={d.duration} compact src={d.src} />
            </div>
          ))}
        </div>

        {/* Commission CTA */}
        <div className="rounded-3xl border border-red-900/30 bg-gradient-to-br from-red-600/15 to-pink-700/15 p-8 md:p-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Want something custom? 🔥
          </h2>
          <p className="text-pink-100/70 mb-6 max-w-lg mx-auto">
            Commission a personalized spicy voice reel tailored to your preferences.
          </p>
          <Link
            to="/commissions"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-lg hover:scale-105 transition-transform"
          >
            <Lock size={18} /> Commission Spicy Voice Work
          </Link>
        </div>
      </div>
    </div>
  );
}