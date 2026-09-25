import React, { useState } from "react";
import { portfolio, portfolioCategories } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import { ExternalLink } from "lucide-react";

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = portfolio.filter((p) => {
    const catMatch = active === "All" || p.category === active;
    const qMatch = !query || (p.name + p.role + p.character + p.desc).toLowerCase().includes(query.toLowerCase());
    return catMatch && qMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="Portfolio" title="Projects & Roles" subtitle="A curated collection of voice work and collaborations." />

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="flex-1 px-4 py-2.5 rounded-full border border-pink-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {portfolioCategories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === c
                ? "text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow"
                : "text-plum-600 bg-white border border-pink-100 hover:bg-pink-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <div key={p.name} className="group rounded-3xl bg-white border border-pink-100 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-pink-100 to-fuchsia-100 grid place-items-center text-4xl">🎙️</div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">{p.category}</span>
                <span className="text-xs text-plum-400">{p.year}</span>
              </div>
              <h3 className="font-bold text-plum-900">{p.name}</h3>
              <p className="text-sm text-plum-500 mt-1">{p.role} · {p.character}</p>
              <p className="text-sm text-plum-400 mt-2">{p.desc}</p>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-pink-500 hover:underline">
                View Project <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-plum-400 py-12">No projects found. Try a different search! 💕</p>
      )}
    </div>
  );
}