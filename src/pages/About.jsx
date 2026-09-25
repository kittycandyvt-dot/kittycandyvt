import React from "react";
import { about, site } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";

const aboutImg = "";

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-pink-100 last:border-0">
      <span className="text-sm text-plum-400 font-medium">{label}</span>
      <span className="text-sm text-plum-900 font-semibold text-right">{value}</span>
    </div>);

}

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="About" title={`Meet ${site.vtuberName}`} subtitle="Get to know the voice behind the temptation~" />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="w-full aspect-[3/4] rounded-3xl shadow-xl border-4 border-white bg-gradient-to-br from-pink-100 to-fuchsia-100 grid place-items-center text-plum-400 text-center">
              <div>
                <div className="text-6xl mb-2">💖</div>
                <p className="text-sm font-medium">Your Portrait</p>
              </div>
            </div>
            <div className="mt-5 glass rounded-2xl p-5">
              {Object.entries(about.profile).map(([k, v]) =>
              <ProfileRow key={k} label={k} value={v} />
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl font-bold text-plum-900 mb-2 flex items-center gap-2">💖 About Me</h3>
            <p className="text-plum-600">{about.aboutMe}</p>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="font-display text-xl font-bold text-plum-900 mb-2 flex items-center gap-2">✨ Lore</h3>
            <p className="text-plum-600 italic">{about.lore}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-bold text-plum-900 mb-2">🌟 Personality</h3>
              <div className="flex flex-wrap gap-2">
                {about.personality.map((p) =>
                <span key={p} className="px-3 py-1 rounded-full text-xs font-medium text-pink-600 bg-pink-50 border border-pink-100">{p}</span>
                )}
              </div>
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-bold text-plum-900 mb-2">💕 Likes</h3>
              <ul className="space-y-1 text-sm text-plum-600">
                {about.likes.map((l) => <li key={l}>💗 {l}</li>)}
              </ul>
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-bold text-plum-900 mb-2">🚫 Dislikes</h3>
              <ul className="space-y-1 text-sm text-plum-600">
                {about.dislikes.map((l) => <li key={l}>💔 {l}</li>)}
              </ul>
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-bold text-plum-900 mb-2">🎉 Fun Facts</h3>
              <ul className="space-y-1 text-sm text-plum-600">
                {about.funFacts.map((l) => <li key={l}>⭐ {l}</li>)}
              </ul>
            </div>
          </div>

          {/* Character Stats */}
          














          
        </div>
      </div>
    </div>);

}