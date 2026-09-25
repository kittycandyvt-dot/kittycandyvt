import React, { useState } from "react";
import { merch, merchCategories } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import { ShoppingBag } from "lucide-react";

export default function Merch() {
  const [active, setActive] = useState("All");
  const cats = ["All", ...merchCategories];
  const filtered = active === "All" ? merch : merch.filter((m) => m.category === active);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="Merch" title="Cute Merch Store 🛍️" subtitle="Take a little piece of the magic home with you." />

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {cats.map((c) => (
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
        {filtered.map((m) => (
          <div key={m.name} className="rounded-3xl bg-white border border-pink-100 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-square bg-gradient-to-br from-pink-100 to-fuchsia-100 grid place-items-center text-5xl overflow-hidden">
              {m.img ? (
                <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <span>🎁</span>
              )}
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">{m.category}</span>
              <h3 className="font-bold text-plum-900 mt-1">{m.name}</h3>
              <p className="text-sm text-plum-400 mt-1">{m.desc}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="font-display text-xl font-bold text-plum-900">{m.price}</span>
                {m.available && m.link ? (
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:scale-105 shadow"
                  >
                    <ShoppingBag size={14} /> Buy
                  </a>
                ) : (
                  <button
                    disabled={!m.available}
                    className={`inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      m.available
                        ? "text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:scale-105 shadow"
                        : "text-plum-400 bg-pink-50 cursor-not-allowed"
                    }`}
                  >
                    {m.available ? (<><ShoppingBag size={14} /> Buy</>) : "Sold Out"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}