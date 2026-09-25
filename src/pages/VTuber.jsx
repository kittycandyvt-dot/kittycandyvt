import React from "react";
import { vtuberModel, about } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";

export default function VTuber() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="VTuber Hub" title="The Model & Magic" subtitle="Everything about the avatar behind the voice." />

      {/* MODEL */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-pink-100 to-fuchsia-100 border border-pink-200 grid place-items-center text-6xl">🎀</div>
        <div className="glass rounded-3xl p-8">
          <h3 className="font-display text-2xl font-bold text-plum-900 mb-4">Current Model</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-pink-100"><span className="text-plum-400 text-sm">Model Artist</span><span className="font-semibold text-plum-900">{vtuberModel.modelArtist}</span></div>
            <div className="flex justify-between py-2 border-b border-pink-100"><span className="text-plum-400 text-sm">Rigging Artist</span><span className="font-semibold text-plum-900">{vtuberModel.riggingArtist}</span></div>
            <div className="flex justify-between py-2"><span className="text-plum-400 text-sm">Model Version</span><span className="font-semibold text-plum-900">{vtuberModel.modelVersion}</span></div>
          </div>
        </div>
      </div>

      {/* OUTFITS */}
      <div className="mb-16">
        <SectionHeading eyebrow="Outfits" title="Wardrobe of dreams" />
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
          {vtuberModel.outfits.map((o) => (
            <div key={o.name} className="snap-start shrink-0 w-64 rounded-3xl bg-white border border-pink-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 to-fuchsia-100 grid place-items-center text-4xl">👗</div>
              <div className="p-4">
                <h4 className="font-bold text-plum-900">{o.name}</h4>
                <p className="text-xs text-plum-400 mt-1">{o.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODEL HISTORY */}
      <div className="mb-16">
        <SectionHeading eyebrow="Model History" title="Evolution timeline" />
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-pink-200" />
          {vtuberModel.modelHistory.map((h) => (
            <div key={h.version} className="relative mb-6">
              <div className="absolute -left-[1.35rem] top-1 w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 border-2 border-white shadow" />
              <div className="glass rounded-2xl p-4">
                <div className="flex flex-wrap justify-between items-center">
                  <h4 className="font-bold text-plum-900">{h.version}</h4>
                  <span className="text-xs text-pink-500 font-semibold">{h.date}</span>
                </div>
                <p className="text-sm text-plum-500 mt-1">{h.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LORE */}
      <div className="mb-16 rounded-3xl bg-gradient-to-br from-pink-100 to-fuchsia-100 p-8 md:p-12 border border-pink-200">
        <SectionHeading eyebrow="Lore" title="The story of KittyCandy" />
        <p className="text-plum-700 italic text-lg max-w-2xl mx-auto text-center">
          {about.lore}
        </p>
      </div>

      {/* FANART */}
      <div>
        <SectionHeading eyebrow="Fanart" title="Art from lovely fans 💕" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {vtuberModel.fanart.map((f) => (
            <div key={f.artist} className="rounded-3xl bg-white border border-pink-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-pink-100 to-fuchsia-100 grid place-items-center text-3xl">🎨</div>
              <div className="p-3 text-center">
                <a href={f.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-pink-500 hover:underline">{f.artist}</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}