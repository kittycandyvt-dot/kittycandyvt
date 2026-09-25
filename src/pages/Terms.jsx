import React from "react";
import { terms, aiPolicy } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import { ShieldAlert } from "lucide-react";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="Terms & Policies" title="The Fine Print" subtitle="Please read carefully before commissioning." />

      <div className="space-y-4 mb-10">
        {terms.map((t) => (
          <div key={t.title} className="glass rounded-3xl p-6">
            <h3 className="font-bold text-plum-900 mb-1">{t.title}</h3>
            <p className="text-sm text-plum-600">{t.body}</p>
          </div>
        ))}
      </div>

      {/* AI POLICY */}
      <div className="rounded-3xl border-2 border-pink-300 bg-pink-50 p-6 md:p-8">
        <div className="flex items-start gap-3">
          <ShieldAlert className="text-pink-600 shrink-0" size={28} />
          <div>
            <h3 className="font-display text-xl font-bold text-plum-900">AI / Voice Cloning Policy</h3>
            <p className="text-sm text-plum-700 mt-2">{aiPolicy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}