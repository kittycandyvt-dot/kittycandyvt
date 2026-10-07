import React from "react";
import { BookHeart, ArrowRight, CheckCircle2 } from "lucide-react";
import Sparkles from "@/components/Sparkles";

const PLANNER_URL = "https://liberal-pulse-plan-pro.base44.app";

const features = [
  "Stream & content schedule planner",
  "Commission tracking & client notes",
  "Goal setting & monthly milestones",
  "Cute, pink, VTuber-themed design",
];

export default function PlannerSection() {
  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden border border-pink-200 bg-white/70 backdrop-blur-md shadow-xl">
        <div className="grid md:grid-cols-2 items-center">
          {/* Visual / placeholder */}
          <div className="relative h-64 md:h-full min-h-[280px] bg-gradient-to-br from-pink-100 to-fuchsia-100 grid place-items-center p-8">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-500 to-fuchsia-500 grid place-items-center text-white shadow-lg">
                <BookHeart size={40} />
              </div>
              <p className="mt-4 font-display text-xl font-bold text-plum-900">
                VTuber Planner
              </p>
              <p className="text-sm text-plum-500">by KittyCandyVT</p>
            </div>
          </div>

          {/* Copy + CTA */}
          <div className="p-8 md:p-10">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-2">
              New Release
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-plum-900">
              The VTuber Planner ✨
            </h2>
            <p className="mt-3 text-plum-600">
              Plan your streams, track commissions, and stay organized with a
              planner designed just for VTubers and content creators.
            </p>

            <ul className="mt-6 space-y-2.5">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-plum-700">
                  <CheckCircle2 size={18} className="text-pink-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href={PLANNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform"
            >
              Get the Planner
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}