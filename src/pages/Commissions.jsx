import React, { useState } from "react";
import { Link } from "react-router-dom";
import { pricing, pricingAddons, whatIOffer, turnaround, commissionProcess } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import ReviewForm from "@/components/ReviewForm";
import ReviewList from "@/components/ReviewList";

export default function Commissions() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="Commissions" title="Voice Acting Commissions" subtitle="Transparent pricing. Professional delivery. Magical results." />

      {/* PRICING */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {pricing.map((p, i) => (
          <div key={p.duration} className={`rounded-3xl p-6 text-center border ${i === 2 ? "bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white border-transparent shadow-xl scale-105" : "glass border-pink-100"}`}>
            <p className={`text-sm font-semibold ${i === 2 ? "text-pink-50" : "text-pink-500"}`}>{p.duration}</p>
            <p className={`font-display text-3xl font-extrabold mt-2 ${i === 2 ? "text-white" : "text-plum-900"}`}>${p.price}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {pricingAddons.map((a) => (
          <div key={a.label} className="px-5 py-2.5 rounded-full bg-pink-50 border border-pink-100 text-sm">
            <span className="font-bold text-pink-600">{a.label}</span>
            <span className="text-plum-400"> — {a.note}</span>
          </div>
        ))}
      </div>

      {/* WHAT I OFFER */}
      <div className="mb-12">
        <SectionHeading eyebrow="What I Offer" title="Services" />
        <div className="flex flex-wrap gap-2 justify-center">
          {whatIOffer.map((s) => (
            <span key={s} className="px-4 py-2 rounded-full text-sm font-medium text-plum-600 bg-white border border-pink-100 hover:bg-pink-50 transition-colors">{s}</span>
          ))}
        </div>
      </div>

      {/* TURNAROUND */}
      <div className="mb-12 glass rounded-3xl p-6 text-center">
        <h3 className="font-display text-xl font-bold text-plum-900 mb-1">⏱️ Turnaround Time</h3>
        <p className="text-plum-600">{turnaround}</p>
      </div>

      {/* PROCESS */}
      <div className="mb-12">
        <SectionHeading eyebrow="Commission Process" title="How it works" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {commissionProcess.map((s) => (
            <div key={s.step} className="glass rounded-3xl p-6 relative">
              <div className="absolute -top-3 -left-3 grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white font-bold text-sm shadow">{s.step}</div>
              <h4 className="font-bold text-plum-900 mt-2">{s.title}</h4>
              <p className="text-sm text-plum-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mb-12">
        <SectionHeading eyebrow="Client Love" title="Reviews" subtitle="See what clients say about their custom voice work." />
        <ReviewList />
      </div>

      {/* LEAVE A REVIEW */}
      <div className="mb-12">
        <SectionHeading eyebrow="Share Your Experience" title="Leave a Review" subtitle="Worked with me? I'd love to hear about it!" />
        <ReviewForm />
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-xl hover:scale-105 transition-transform text-lg">
          ✨ Request a Commission
        </Link>
      </div>
    </div>
  );
}