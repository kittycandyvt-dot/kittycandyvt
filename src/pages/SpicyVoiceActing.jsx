import React, { useState } from "react";
import { Link } from "react-router-dom";
import { spicyVoiceDemos, spicyIntro } from "@/data/siteData";
import AgeGate from "@/components/AgeGate";
import AudioPlayer from "@/components/AudioPlayer";
import { Flame, ArrowLeft, Lock, Heart, Sparkles } from "lucide-react";

const spicyCategories = [
  "Seductive",
  "Dominant",
  "Submissive",
  "Playful",
  "Wholesome",
  "Roleplay",
];

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
          <ArrowLeft size={16} />
          Back to Voice Acting
        </Link>

        {/* Hero */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-red-600/20 to-pink-700/20 border border-red-900/30 p-8 md:p-12 text-center relative overflow-hidden">

          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 grid place-items-center text-white mb-4 shadow-lg shadow-pink-600/20">
              <Flame size={30} />
            </div>

            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-red-400 mb-2">
              18+ NSFW Voice Acting
            </span>

            <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
              The Spicy Side
            </h1>

            <p className="text-pink-100/70 max-w-xl mx-auto">
              {spicyIntro}
            </p>

          </div>
        </div>

        {/* Support / Exclusive Content */}
        <div className="mb-12 rounded-3xl border border-pink-900/30 bg-gradient-to-br from-[#180914]/90 to-[#10060f]/90 backdrop-blur-xl p-6 md:p-8 text-center relative overflow-hidden">

          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-pink-600/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            {/* Icon */}
            <div className="flex justify-center mb-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/20 grid place-items-center">
                <Heart
                  size={20}
                  className="text-pink-400"
                />
              </div>
            </div>

            <h2 className="font-display text-xl md:text-2xl font-bold mb-2">
              Want more of Kitty? 💕
            </h2>

            <p className="text-pink-100/60 text-sm md:text-base max-w-xl mx-auto mb-6">
              Support my work and get access to more exclusive content,
              behind-the-scenes goodies, and spicy extras.
            </p>

            {/* Social / Support buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">

              {/* Fansly */}
              <a
                href="https://fansly.com/KittyCandyVT"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit KittyCandyVT on Fansly"
                className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:scale-[1.03] transition-all duration-300"
              >
                <div className="relative rounded-2xl bg-[#120812]/95 px-6 py-5 text-center h-full">

                  <div className="text-2xl mb-1">
                    💗
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Fansly
                  </h3>

                  <p className="text-sm text-pink-200/70 mt-1">
                    A little more of Kitty 😽
                  </p>

                  <span className="inline-block mt-3 text-xs font-semibold text-pink-400 group-hover:text-pink-300 transition-colors">
                    Visit Fansly →
                  </span>

                </div>
              </a>

              {/* Patreon */}
              <a
                href="https://www.patreon.com/c/SpicyKittyxxVA?vanity=user"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit SpicyKittyVA on Patreon"
                className="group relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:scale-[1.03] transition-all duration-300"
              >
                <div className="relative rounded-2xl bg-[#120812]/95 px-6 py-5 text-center h-full">

                  <div className="text-2xl mb-1">
                    🧡
                  </div>

                  <h3 className="text-lg font-bold text-white">
                    Patreon
                  </h3>

                  <p className="text-sm text-orange-200/70 mt-1">
                    Support KittyCandyVT ✨
                  </p>

                  <span className="inline-block mt-3 text-xs font-semibold text-orange-400 group-hover:text-orange-300 transition-colors">
                    Join my Patreon →
                  </span>

                </div>
              </a>

            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">

          {["All", ...spicyCategories].map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCat === c
                  ? "text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-pink-500/20"
                  : "text-pink-200/70 border border-red-900/30 hover:bg-white/5 hover:text-pink-100"
              }`}
            >
              {c}
            </button>
          ))}

        </div>

        {/* Demo grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-16">

          {filtered.length > 0 ? (
            filtered.map((d) => (
              <div
                key={d.title}
                className="rounded-3xl border border-red-900/30 bg-gradient-to-br from-[#1a0a12] to-[#120709] p-5 hover:border-red-700/50 transition-all duration-300"
              >

                <div className="flex items-center justify-between mb-3">

                  <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
                    {d.category}
                  </span>

                  <span className="text-xs text-pink-300/50">
                    {d.duration}
                  </span>

                </div>

                <h3 className="font-bold text-white mb-1">
                  {d.title}
                </h3>

                <p className="text-sm text-pink-200/50 mb-3">
                  {d.type} voice
                </p>

                <AudioPlayer
                  title={d.title}
                  subtitle={`${d.type} · ${d.category}`}
                  duration={d.duration}
                  compact
                  src={d.src}
                />

              </div>
            ))
          ) : (
            <div className="md:col-span-2 text-center py-12">
              <p className="text-pink-200/50">
                No demos available in this category yet. 💕
              </p>
            </div>
          )}

        </div>

        {/* Commission CTA */}
        <div className="rounded-3xl border border-red-900/30 bg-gradient-to-br from-red-600/15 to-pink-700/15 p-8 md:p-10 text-center relative overflow-hidden">

          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-red-500/10 blur-3xl rounded-full" />

          <div className="relative z-10">

            <div className="flex justify-center mb-4">
              <Sparkles
                size={28}
                className="text-pink-400"
              />
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
              Want something custom? 🔥
            </h2>

            <p className="text-pink-100/70 mb-6 max-w-lg mx-auto">
              Commission a personalized spicy voice reel tailored to your preferences.
            </p>

            <Link
              to="/commissions"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform"
            >
              <Lock size={18} />
              Commission Spicy Voice Work
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}