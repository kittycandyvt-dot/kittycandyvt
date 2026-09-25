import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles as SparkleIcon, Heart, Mic, Video, Users, ArrowRight, Play, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { site, latestContent, sponsors } from "@/data/siteData";
import Sparkles from "@/components/Sparkles";
import SocialLinks from "@/components/SocialLinks";
import SectionHeading from "@/components/SectionHeading";
import AudioPlayer from "@/components/AudioPlayer";
import StreamSchedule from "@/components/StreamSchedule";

const heroImg = "";

const whatIDo = [
  { icon: "🎀", title: "VTubing", desc: "Streaming, gaming, chatting and entertainment." },
  { icon: "🎙️", title: "Voice Acting", desc: "Character voices, animation, games and more." },
  { icon: "✨", title: "Content Creation", desc: "Videos, shorts, social media and promotional content." },
  { icon: "💼", title: "Collaborations", desc: "Brand deals, sponsorships and creative projects." },
];

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 via-white to-pink-50/50" />
        <Sparkles count={16} />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 text-center md:text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 ${site.status === "live" ? "bg-red-100 text-red-600 animate-pulse-glow" : "bg-pink-100 text-pink-600"}`}>
              {site.status === "live" ? "🔴 LIVE NOW" : "💗 OFFLINE"}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-plum-900 leading-tight">
              {site.vtuberName}
            </h1>
            <p className="mt-3 text-lg font-semibold text-pink-500">{site.title}</p>
            <p className="mt-2 text-plum-500 italic">"{site.tagline}"</p>
            <p className="mt-4 text-plum-600 max-w-md mx-auto md:mx-0">{site.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
              <a href={site.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform">
                <Play size={18} /> Watch Me Live
              </a>
              <Link to="/commissions" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-plum-900 bg-white border border-pink-200 shadow-sm hover:bg-pink-50 transition-colors">
                <Mic size={18} /> Hire Me
              </Link>
            </div>
            <div className="mt-6 flex justify-center md:justify-start">
              <SocialLinks />
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-pink-200 to-fuchsia-200 rounded-full blur-2xl opacity-60" />
              <div className="relative w-72 md:w-96 aspect-[3/4] rounded-[2rem] shadow-2xl border-4 border-white bg-gradient-to-br from-pink-100 to-fuchsia-100 grid place-items-center">
                <div className="text-center text-plum-400">
                  <div className="text-6xl mb-2">🎀</div>
                  <p className="text-sm font-medium">Your VTuber Artwork</p>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 grid place-items-center w-12 h-12 rounded-full bg-white shadow-lg text-pink-500">
                <Star size={22} className="fill-pink-400 text-pink-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MEET THE VTUBER */}
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-pink-100 to-fuchsia-100 border border-pink-200 grid place-items-center text-plum-400 text-center">
            <div>
              <div className="text-5xl mb-2">🌸</div>
              <p className="text-sm font-medium">Your Photo</p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Meet the VTuber" title="A star with a voice like honey" center={false} />
            <p className="text-plum-600">{site.intro}</p>
            <Link to="/about" className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform">
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <StreamSchedule />

      {/* HEAR MY VOICE */}
      <section className="py-16 px-4 md:px-6 bg-pink-50/50">
        <div className="max-w-4xl mx-auto">
          <SectionHeading eyebrow="Hear My Voice" title="Listen to my demos" subtitle="A taste of the characters and tones I can bring to life." />
          <AudioPlayer title="Featured Demo Reel" subtitle="Voice Actress · All ranges" duration="1:30" />
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {["Character Voices", "Commercial", "Narration", "More Demos"].map((b) => (
              <span key={b} className="px-4 py-2 rounded-full text-sm font-medium text-pink-600 bg-white border border-pink-100 hover:bg-pink-50 cursor-pointer transition-colors">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT I DO */}
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <SectionHeading eyebrow="What I Do" title="Talents & services" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {whatIDo.map((c) => (
            <div key={c.title} className="glass rounded-3xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-bold text-plum-900 mb-1">{c.title}</h3>
              <p className="text-sm text-plum-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPONSORS */}
      <section className="py-16 px-4 md:px-6 bg-pink-50/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeading eyebrow="Sponsors & Partners" title="Brands I love" subtitle="Use my affiliate links for sweet perks ✨" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {sponsors.map((s) => (
              <a
                key={s.name}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-3xl p-8 flex flex-col items-center justify-center gap-4 text-center bg-gradient-to-br from-plum-900 to-plum-800 border border-pink-300/30 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm p-2 grid place-items-center overflow-hidden">
                  <img src={s.img} alt={`${s.name} logo`} className="w-full h-full object-contain rounded-xl" />
                </div>
                <span className="relative font-display text-lg font-bold text-white">{s.name}</span>
                {s.promo && (
                  <span className="relative inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow">{s.promo}</span>
                )}
                <span className="relative text-xs font-medium text-pink-300 group-hover:text-fuchsia-300 transition-colors">Visit Partner ↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WORK WITH ME */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-pink-500 to-fuchsia-500 p-10 md:p-14 text-center text-white relative overflow-hidden">
          <Sparkles count={8} />
          <h2 className="relative font-display text-3xl md:text-4xl font-bold">Have a project in mind?</h2>
          <p className="relative mt-2 text-pink-50">Let's create something magical together. 💕</p>
          <div className="relative mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/commissions" className="px-6 py-3 rounded-full font-semibold text-pink-600 bg-white shadow-lg hover:scale-105 transition-transform">Voice Acting Commissions</Link>
            <Link to="/contact" className="px-6 py-3 rounded-full font-semibold text-white border-2 border-white/70 hover:bg-white/10 transition-colors">Business Inquiries</Link>
          </div>
        </div>
      </section>

      {/* SOCIALS */}
      <section className="py-16 px-4 md:px-6 max-w-4xl mx-auto text-center">
        <SectionHeading eyebrow="Socials" title="Follow the journey" />
        <div className="flex justify-center">
          <SocialLinks size={22} />
        </div>
      </section>
    </div>
  );
}