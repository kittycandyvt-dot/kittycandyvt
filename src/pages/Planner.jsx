import React from "react";
import { BookHeart, ExternalLink } from "lucide-react";

const PLANNER_URL = "https://liberal-pulse-plan-pro.base44.app";

export default function Planner() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 grid place-items-center text-white shadow">
            <BookHeart size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-plum-900">
              VTuber Planner
            </h1>
            <p className="text-sm text-plum-500">by KittyCandyVT</p>
          </div>
        </div>
        <a
          href={PLANNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-pink-600 hover:text-fuchsia-600 transition-colors"
        >
          Open in new tab <ExternalLink size={15} />
        </a>
      </div>

      <div className="rounded-[2rem] overflow-hidden border border-pink-200 shadow-xl bg-white">
        <iframe
          src={PLANNER_URL}
          title="KittyCandyVT VTuber Planner"
          className="w-full"
          style={{ height: "78vh", minHeight: "600px", border: "0" }}
          loading="lazy"
        />
      </div>
    </div>
  );
}