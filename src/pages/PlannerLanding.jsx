import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Calendar, Clapperboard, TrendingUp, Palette, CheckCircle2, ArrowRight, LogIn } from "lucide-react";
import { plannerConfig } from "@/data/plannerConfig";
import SparklesBg from "@/components/Sparkles";

const features = [
  { icon: Calendar, title: "Plan", desc: "Organize streams, content, tasks and goals in one calendar." },
  { icon: Clapperboard, title: "Create", desc: "Manage content ideas and your content pipeline." },
  { icon: TrendingUp, title: "Grow", desc: "Track followers, subscribers and milestones." },
  { icon: Palette, title: "Brand", desc: "Keep your VTuber identity and branding in one place." },
];

const steps = [
  { n: 1, title: "Purchase", desc: "Buy the VTuber Planner through Ko-fi." },
  { n: 2, title: "Create Your Account", desc: "Create your private planner account." },
  { n: 3, title: "Customize", desc: "Choose your colors, decorations and settings." },
  { n: 4, title: "Start Creating", desc: "Plan your streams, content, goals and creator life." },
];

const faqs = [
  { q: "Is this a one-time purchase?", a: "Yes. Pay once and the planner is yours." },
  { q: "Do I need a Ko-fi account?", a: "Ko-fi handles the purchase, but your planner account is separate. You don't need a Ko-fi account to use the planner." },
  { q: "Can I customize it?", a: "Yes. Colors, themes, decorations, fonts and more." },
  { q: "Can I use it on my phone?", a: "Yes. It works on iPhone, Android, tablet and desktop." },
  { q: "Can I use it on multiple devices?", a: "Yes. Log into the same account anywhere." },
  { q: "Is my planner private?", a: "Yes. Each account has its own private data." },
  { q: "What happens after I purchase?", a: "After purchase, create your account with the same email, and access is activated automatically." },
  { q: "How do I get help?", a: "Use the support link in the planner or on the purchase page." },
];

export default function PlannerLanding() {
  return (
    <div className="relative overflow-hidden">
      <SparklesBg count={14} />

      {/* HERO */}
      <section className="relative max-w-5xl mx-auto px-4 md:px-6 pt-16 pb-20 text-center">
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-3">
          {plannerConfig.brandName} presents
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-plum-900 leading-tight">
          {plannerConfig.tagline}
        </h1>
        <p className="mt-4 text-lg text-plum-600 max-w-2xl mx-auto">{plannerConfig.description}</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href={plannerConfig.kofiUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform">
            Get the Planner <ArrowRight size={18} />
          </a>
          <Link to="/planner/dashboard"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-plum-900 bg-white border border-pink-200 shadow-sm hover:bg-pink-50 transition-colors">
            <LogIn size={18} /> Already Purchased? Log In
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-4 md:px-6 bg-pink-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass rounded-3xl p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 grid place-items-center text-white shadow-md mb-3">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-plum-900">{f.title}</h3>
                  <p className="mt-1 text-sm text-plum-500">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 md:px-6 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-plum-900 text-center mb-10">How it works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="glass rounded-3xl p-6 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-pink-500 text-white font-bold grid place-items-center mb-3">{s.n}</div>
              <h3 className="font-bold text-plum-900">{s.title}</h3>
              <p className="mt-1 text-sm text-plum-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 px-4 md:px-6 bg-pink-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-plum-900">Stay organized</h2>
          <p className="mt-2 text-plum-600">Keep your creator life in one place.</p>
          <div className="mt-8 grid sm:grid-cols-2 gap-4 text-left">
            {["Private to your account", "Works on every device", "Fully customizable", "One-time purchase, no subscription"].map((b) => (
              <div key={b} className="flex items-center gap-3 glass rounded-2xl p-4">
                <CheckCircle2 className="text-pink-500 shrink-0" size={20} />
                <span className="text-plum-700 font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 md:px-6 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-plum-900 text-center mb-10">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="glass rounded-2xl p-5 group">
              <summary className="font-semibold text-plum-900 cursor-pointer list-none flex items-center justify-between">
                {f.q} <span className="text-pink-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-sm text-plum-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-pink-500 to-fuchsia-500 p-10 md:p-14 text-center text-white relative overflow-hidden">
          <Sparkles count={8} />
          <h2 className="relative font-display text-3xl md:text-4xl font-bold">Ready to get organized?</h2>
          <p className="relative mt-2 text-pink-50">Your VTuber life, all in one place.</p>
          <div className="relative mt-6 flex flex-wrap gap-3 justify-center">
            <a href={plannerConfig.kofiUrl} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-full font-semibold text-pink-600 bg-white shadow-lg hover:scale-105 transition-transform">
              Get the Planner
            </a>
            <Link to="/planner/dashboard"
              className="px-6 py-3 rounded-full font-semibold text-white border-2 border-white/70 hover:bg-white/10 transition-colors">
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}