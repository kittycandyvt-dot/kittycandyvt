import React from "react";
import { Type } from "lucide-react";
import { wordPricing } from "@/data/siteData";

export default function WordPricing() {
  return (
    <div className="glass rounded-3xl p-6 md:p-8 mb-12">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white shadow-lg">
          <Type size={22} />
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-plum-900">Pay Per Line of Words</h3>
          <p className="text-sm text-plum-500 mt-1">
            Prefer to price by script length instead? Simple flat rate.
          </p>
        </div>

        <div className="flex items-end gap-2">
          <span className="font-display text-5xl font-extrabold text-plum-900">${wordPricing.rate}</span>
          <span className="text-sm font-semibold text-pink-500 pb-2">per {wordPricing.unit}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-1">
          {wordPricing.examples.map((example) => (
            <div key={example.lines} className="px-5 py-2.5 rounded-full bg-white border border-pink-100 text-sm">
              <span className="text-plum-600">{example.lines}</span>
              <span className="font-bold text-pink-600"> — ${example.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}