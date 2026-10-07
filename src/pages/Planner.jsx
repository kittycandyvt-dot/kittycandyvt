import React from "react";
import { BookHeart, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PLANNER_URL = "https://liberal-pulse-plan-pro.base44.app";

export default function Planner() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-20 text-center">
      <div className="glass rounded-3xl p-10">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-fuchsia-500 grid place-items-center text-white shadow-lg mb-4">
          <BookHeart size={32} />
        </div>
        <h1 className="font-display text-3xl font-bold text-plum-900">
          VTuber Planner
        </h1>
        <p className="mt-3 text-plum-600">
          My VTuber Planner lives on its own dedicated app. Tap below to open it
          in a new tab.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a
            href={PLANNER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform"
          >
            Open the Planner <ExternalLink size={18} />
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-plum-900 bg-white border border-pink-200 hover:bg-pink-50 transition-colors"
          >
            <ArrowLeft size={18} /> Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}