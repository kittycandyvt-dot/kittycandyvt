import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function ReviewForm() {
  const [form, setForm] = useState({ clientName: "", clientHandle: "", projectType: "", rating: 5, reviewText: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.reviewText.trim()) {
      setError("Please fill in your name and review.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await base44.entities.CommissionReview.create({
        clientName: form.clientName.trim(),
        clientHandle: form.clientHandle.trim(),
        projectType: form.projectType.trim(),
        rating: Number(form.rating),
        reviewText: form.reviewText.trim(),
        status: "pending",
      });
      setSubmitted(true);
      setForm({ clientName: "", clientHandle: "", projectType: "", rating: 5, reviewText: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <div className="text-4xl mb-3">💖</div>
        <h4 className="font-display text-xl font-bold text-plum-900 mb-2">Thank you for your review!</h4>
        <p className="text-plum-500 mb-6">Your review has been submitted and will appear here once approved.</p>
        <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-full">Leave another review</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-plum-700">Name *</span>
          <input
            type="text"
            value={form.clientName}
            onChange={update("clientName")}
            required
            className="mt-1 w-full rounded-xl border border-pink-200 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-plum-700">Social Handle</span>
          <input
            type="text"
            value={form.clientHandle}
            onChange={update("clientHandle")}
            className="mt-1 w-full rounded-xl border border-pink-200 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="@username (optional)"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-plum-700">Project Type</span>
        <input
          type="text"
          value={form.projectType}
          onChange={update("projectType")}
          className="mt-1 w-full rounded-xl border border-pink-200 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="e.g. Character Voice, NSFW, Narration (optional)"
        />
      </label>

      <div>
        <span className="text-sm font-semibold text-plum-700">Rating *</span>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setForm((f) => ({ ...f, rating: n }))}
              className="transition-transform hover:scale-125"
            >
              <Star
                size={28}
                className={n <= form.rating ? "fill-pink-500 text-pink-500" : "text-pink-200"}
              />
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-plum-700">Your Review *</span>
        <textarea
          value={form.reviewText}
          onChange={update("reviewText")}
          required
          rows={4}
          className="mt-1 w-full rounded-xl border border-pink-200 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
          placeholder="Share your experience working with KittyCandyVT..."
        />
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold hover:scale-[1.02] transition-transform"
      >
        {submitting ? "Submitting..." : "Submit Review ✨"}
      </Button>
    </form>
  );
}