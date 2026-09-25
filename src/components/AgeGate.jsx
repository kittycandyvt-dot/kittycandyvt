import React, { useState, useEffect } from "react";
import { Flame, Lock, Check } from "lucide-react";

export default function AgeGate({ onConfirm }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center p-4 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-red-900/40 bg-gradient-to-br from-[#1a0a12] to-[#0d0610] p-8 md:p-10 text-center shadow-2xl">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 grid place-items-center text-white mb-5">
          <Flame size={30} />
        </div>
        <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-red-400 mb-2">
          18+ Only
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
          Entering the Spicy Side
        </h2>
        <p className="text-sm text-pink-100/70 mb-6">
          This section contains adult (NSFW) voice acting content. By entering, you confirm
          that you are at least 18 years old and consent to hearing mature audio.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Check size={18} /> I'm 18+ — Let me in
          </button>
          <a
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-pink-100/80 border border-pink-900/40 hover:bg-white/5 transition-colors"
          >
            <Lock size={16} /> Take me back
          </a>
        </div>
      </div>
    </div>
  );
}