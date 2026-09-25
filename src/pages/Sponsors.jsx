import React from "react";
import { sponsors, collabTypes } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "react-router-dom";

export default function Sponsors() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="Sponsors & Collaborations" title="Let's Work Together" subtitle="Partner with a creator who brings genuine joy and professionalism." />

      {/* COLLAB TYPES */}
      <div className="flex flex-wrap gap-2 justify-center mb-16">
        {collabTypes.map((c) => (
          <span key={c} className="px-4 py-2 rounded-full text-sm font-medium text-plum-600 bg-white border border-pink-100 hover:bg-pink-50 transition-colors">{c}</span>
        ))}
      </div>

      {/* SPONSORS */}
      <div className="mb-16">
        <SectionHeading eyebrow="Partners" title="Trusted by lovely brands" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {sponsors.map((s) => (
            <a
              key={s.name}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center bg-gradient-to-br from-plum-900 to-plum-800 border border-pink-300/30 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-2 grid place-items-center overflow-hidden">
                <img src={s.img} alt={`${s.name} logo`} className="w-full h-full object-contain rounded-xl" />
              </div>
              <span className="relative font-display text-lg font-bold text-white">{s.name}</span>
              {s.promo && (
                <span className="relative inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow">{s.promo}</span>
              )}
              <span className="relative text-xs font-medium text-pink-300 group-hover:text-fuchsia-300 transition-colors">Visit Partner ↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform">
          Partner With Me
        </Link>
      </div>
    </div>
  );
}