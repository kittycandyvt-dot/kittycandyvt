import React, { useState } from "react";
import { commissionWork, commissionWorkTypes } from "@/data/siteData";
import { Image } from "@/components/ui/image";
import { ExternalLink, Mic } from "lucide-react";

export default function CommissionGallery() {
  const [active, setActive] = useState("All");

  const items = active === "All" ? commissionWork : commissionWork.filter((c) => c.type === active);

  return (
    <div>
      {/* FILTERS */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {commissionWorkTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActive(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active === type
                ? "text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow"
                : "text-plum-600 bg-white border border-pink-100 hover:bg-pink-50"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((work, i) => (
          <article
            key={`${work.title}-${work.type}-${i}`}
            className="group glass rounded-3xl overflow-hidden border border-pink-100 hover:shadow-xl transition-shadow"
          >
            {work.img ? (
              <Image src={work.img} alt={work.title || work.client} className="w-full aspect-[4/3]" />
            ) : (
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-pink-100 via-pink-50 to-fuchsia-100 grid place-items-center">
                <Mic className="text-pink-300" size={40} />
              </div>
            )}
            <div className="p-5">
              <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">{work.type}</span>
              <h3 className="font-display text-lg font-bold text-plum-900 mt-1">{work.title || work.client}</h3>
              {work.title && <p className="text-sm text-plum-400">{work.client}</p>}
              <p className="text-sm text-plum-500 mt-2">{work.desc}</p>
              {work.link && (
                <a href={work.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-pink-500 hover:underline">
                  View post <ExternalLink size={14} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-plum-400 py-12">No work in this category yet. Check back soon! 💕</p>
      )}
    </div>
  );
}