import React from "react";
import { voiceDemos, voiceCategories, vocalRange, homeStudio } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import AudioPlayer from "@/components/AudioPlayer";

const studioImg = "";

export default function VoiceActing() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="Voice Acting" title="Professional Voice Portfolio" subtitle="A full spectrum of characters, tones, and styles." />

      {/* DEMO REEL */}
      <div className="mb-12 rounded-3xl bg-gradient-to-br from-pink-500 to-fuchsia-500 p-8 md:p-12 text-white text-center relative overflow-hidden">
        <h2 className="font-display text-2xl md:text-3xl font-bold relative">Voice Acting Demo Reel</h2>
        <p className="text-pink-50 mt-1 relative">The ultimate showcase reel</p>
        <div className="mt-6 max-w-md mx-auto relative">
          <div className="flex items-center justify-center gap-4 rounded-2xl bg-white/20 backdrop-blur-md px-6 py-4">
            <button className="grid place-items-center w-14 h-14 rounded-full bg-white text-pink-500 shadow-lg hover:scale-110 transition-transform">
              <span className="ml-1">▶</span>
            </button>
            <div className="flex-1 text-left">
              <p className="font-semibold">Full Demo Reel</p>
              <p className="text-xs text-pink-100">All ranges · 2:15</p>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {voiceCategories.map((c) => (
            <span key={c} className="px-4 py-2 rounded-full text-sm font-medium text-plum-600 bg-white border border-pink-100 hover:bg-pink-50 cursor-pointer transition-colors">{c}</span>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {voiceDemos.map((d) => (
            <div key={d.title} className="glass rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">{d.category}</span>
                <span className="text-xs text-plum-400">{d.duration}</span>
              </div>
              <h3 className="font-bold text-plum-900 mb-1">{d.title}</h3>
              <p className="text-sm text-plum-400 mb-3">{d.type} voice</p>
              <AudioPlayer title={d.title} subtitle={`${d.type} · ${d.category}`} duration={d.duration} compact />
            </div>
          ))}
        </div>
      </div>

      {/* VOCAL RANGE */}
      <div className="mb-12 glass rounded-3xl p-8">
        <SectionHeading eyebrow="Vocal Range" title="What I can do" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(vocalRange).map(([k, v]) => (
            <div key={k}>
              <h4 className="font-semibold text-plum-900 mb-2 capitalize">{k.replace(/([A-Z])/g, " $1")}</h4>
              <div className="flex flex-wrap gap-2">
                {v.map((item) => (
                  <span key={item} className="px-3 py-1 rounded-full text-xs font-medium text-pink-600 bg-pink-50 border border-pink-100">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOME STUDIO */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="w-full aspect-[4/3] rounded-3xl shadow-xl border-4 border-white bg-gradient-to-br from-pink-100 to-fuchsia-100 grid place-items-center text-plum-400 text-center">
          <div>
            <div className="text-6xl mb-2">🎙️</div>
            <p className="text-sm font-medium">Your Studio Photo</p>
          </div>
        </div>
        <div className="glass rounded-3xl p-8">
          <h3 className="font-display text-2xl font-bold text-plum-900 mb-4">🏠 Home Studio</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-pink-100"><span className="text-plum-400 text-sm">Microphone</span><span className="font-semibold text-plum-900">{homeStudio.microphone}</span></div>
            <div className="flex justify-between py-2 border-b border-pink-100"><span className="text-plum-400 text-sm">Interface</span><span className="font-semibold text-plum-900">{homeStudio.interface}</span></div>
            <div className="flex justify-between py-2 border-b border-pink-100"><span className="text-plum-400 text-sm">Software</span><span className="font-semibold text-plum-900">{homeStudio.software}</span></div>
            <div className="flex justify-between py-2"><span className="text-plum-400 text-sm">Environment</span><span className="font-semibold text-plum-900 text-right text-sm">{homeStudio.environment}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}