import React from "react";
import { sponsors, collabTypes, testimonials } from "@/data/siteData";
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {sponsors.map((s) => (
            <a
              key={s.name}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-[4/3] grid place-items-center rounded-2xl bg-white border border-pink-100 text-plum-600 font-semibold hover:bg-pink-50 hover:scale-105 transition-all text-center px-2"
            >
              {s.name}
            </a>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div>
        <SectionHeading eyebrow="Testimonials" title="Kind words from clients" />
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-3xl p-6">
              <p className="text-plum-700 italic">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-fuchsia-300 grid place-items-center text-white font-bold">{t.name[0]}</div>
                <div>
                  <p className="font-semibold text-plum-900 text-sm">{t.name}</p>
                  <p className="text-xs text-plum-400">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
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