import React from "react";
import { Link } from "react-router-dom";
import { spicyVoiceDemos, spicyIntro } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import AudioPlayer from "@/components/AudioPlayer";
import AgeGate from "@/components/AgeGate";
import { Flame, ArrowLeft } from "lucide-react";

export default function VoiceActing() {
  return (
    <AgeGate>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-plum-500 hover:text-pink-500 transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* HERO */}
        <div className="mb-12 rounded-3xl bg-gradient-to-br from-[#1a0a12] to-[#0d0610] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-pink-600 grid place-items-center text-white mb-4">
            <Flame size={28} />
          </div>
          <SectionHeading eyebrow="18+ Only" title="Spicy Voice Acting" />
          <p className="text-pink-100/70 max-w-lg mx-auto text-sm">{spicyIntro}</p>
        </div>

        {/* DEMOS */}
        <div className="grid md:grid-cols-2 gap-4">
          {spicyVoiceDemos.map((d) => (
            <div key={d.title} className="rounded-3xl bg-white/70 backdrop-blur-md border border-pink-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">{d.type}</span>
                <span className="text-xs text-plum-400">{d.duration}</span>
              </div>
              <h3 className="font-bold text-plum-900 mb-1">{d.title}</h3>
              <p className="text-sm text-plum-400 mb-3">{d.category}</p>
              <AudioPlayer title={d.title} subtitle={`${d.type} · ${d.category}`} duration={d.duration} compact />
            </div>
          ))}
        </div>
      </div>
    </AgeGate>
  );
}