import React, { useState } from "react";
import { site } from "@/data/siteData";
import SectionHeading from "@/components/SectionHeading";
import SocialLinks from "@/components/SocialLinks";
import { Mail, Upload, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [agree, setAgree] = useState(false);

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle className="mx-auto text-pink-500 mb-4" size={64} />
        <h2 className="font-display text-3xl font-bold text-plum-900">Thank you! 💕</h2>
        <p className="mt-3 text-plum-600">Your commission request has been received. I'll get back to you within 1–2 business days. Get ready for something magical!</p>
        <button onClick={() => setSubmitted(false)} className="mt-6 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform">
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <SectionHeading eyebrow="Contact" title="Let's Connect" subtitle="Business inquiries and voice acting commissions welcome." />

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-xl font-bold text-plum-900 mb-2">💼 Business Inquiries</h3>
          <p className="text-sm text-plum-500 mb-3">For sponsorships, collaborations, and partnerships.</p>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-pink-500 font-semibold hover:underline">
            <Mail size={16} /> {site.email}
          </a>
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-xl font-bold text-plum-900 mb-2">🎙️ Voice Acting</h3>
          <p className="text-sm text-plum-500 mb-3">Submit a commission request using the form below.</p>
          <a href="#commission-form" className="inline-flex items-center gap-2 text-pink-500 font-semibold hover:underline">
            Jump to form →
          </a>
        </div>
      </div>

      {/* COMMISSION FORM */}
      <form id="commission-form" onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 space-y-5">
        <h3 className="font-display text-2xl font-bold text-plum-900">Commission Request Form</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name" name="name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Discord" name="discord" />
          <Field label="Project Name" name="projectName" required />
          <Field label="Project Type" name="projectType" />
          <Field label="Character Name" name="characterName" />
          <Field label="Desired Voice" name="desiredVoice" />
          <Field label="Tone" name="tone" />
          <Field label="Emotion" name="emotion" />
          <Field label="Deadline" name="deadline" type="date" />
        </div>

        <div>
          <label className="block text-sm font-medium text-plum-700 mb-1">Script</label>
          <textarea name="script" rows={4} className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" placeholder="Paste your script here..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-plum-700 mb-1">Pronunciation Notes</label>
          <textarea name="pronunciation" rows={2} className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
        </div>

        <div>
          <label className="block text-sm font-medium text-plum-700 mb-1">Additional Information</label>
          <textarea name="additional" rows={2} className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm text-plum-700">
            <input type="checkbox" name="commercial" className="accent-pink-500 w-4 h-4" /> Commercial Usage
          </label>
          <label className="flex items-center gap-2 text-sm text-plum-700">
            <input type="checkbox" name="nsfw" className="accent-pink-500 w-4 h-4" /> NSFW (18+)
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-plum-700 mb-1">File Uploads (Scripts, references, etc.)</label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/50">
            <Upload size={18} className="text-pink-400" />
            <input type="file" multiple onChange={handleFiles} className="text-sm text-plum-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-pink-500 file:text-white" />
          </div>
          {files.length > 0 && (
            <p className="text-xs text-plum-400 mt-2">{files.length} file(s) selected — stored privately, no public URL, so access follows your app's permissions.</p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm text-plum-700">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required className="mt-0.5 accent-pink-500 w-4 h-4" />
          I have read and agree to the commission terms.
        </label>

        <button
          type="submit"
          disabled={!agree}
          className={`w-full py-3.5 rounded-full font-bold text-white shadow-lg transition-all ${agree ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:scale-[1.02]" : "bg-pink-200 cursor-not-allowed"}`}
        >
          Submit Commission Request
        </button>
      </form>

      <div className="mt-10 text-center">
        <h3 className="font-display text-2xl font-bold text-plum-900">Ready to bring your character to life?</h3>
        <p className="text-plum-500 mt-1">Let's make some magic! ✨</p>
        <a href="#commission-form" className="mt-4 inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-xl hover:scale-105 transition-transform">
          Start a Project
        </a>
      </div>

      <div className="mt-10 text-center">
        <h4 className="font-semibold text-plum-900 mb-3">Find me elsewhere</h4>
        <div className="flex justify-center"><SocialLinks /></div>
      </div>
    </div>
  );
}

function Field({ label, name, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-plum-700 mb-1">{label}{required && <span className="text-pink-500"> *</span>}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full px-4 py-2.5 rounded-2xl border border-pink-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
    </div>
  );
}