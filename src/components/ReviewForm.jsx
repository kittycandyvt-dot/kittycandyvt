import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Star, Upload, X } from "lucide-react";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB per file
const ACCEPTED_TYPES = "image/*,video/*";

export default function ReviewForm() {
  const [form, setForm] = useState({ clientName: "", clientHandle: "", projectType: "", rating: 5, reviewText: "" });
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.size <= MAX_FILE_SIZE);
    if (valid.length < selected.length) {
      setError("Some files were skipped (max 25MB each).");
    }
    setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

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

      if (files.length > 0) {
        setUploading(true);
        const fileUrls = [];
        for (const file of files) {
          try {
            const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
            if (file_uri) {
              const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 604800 });
              if (signed_url) fileUrls.push(signed_url);
            }
          } catch (err) {
            console.error("File upload failed:", err);
          }
        }
        if (fileUrls.length > 0) {
          await base44.functions.invoke("sendReviewMedia", {
            fields: { ...form, rating: Number(form.rating), fileUrls },
          });
        }
        setUploading(false);
      }

      setSubmitted(true);
      setForm({ clientName: "", clientHandle: "", projectType: "", rating: 5, reviewText: "" });
      setFiles([]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setUploading(false);
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

      <div>
        <span className="text-sm font-semibold text-plum-700">Photos / Videos</span>
        <p className="text-xs text-plum-400 mb-2">Optional — share a screenshot or clip of the work. Max 25MB per file.</p>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-pink-200 bg-pink-50/50">
          <Upload size={18} className="text-pink-400" />
          <input type="file" accept={ACCEPTED_TYPES} multiple onChange={handleFiles} className="text-sm text-plum-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-pink-500 file:text-white" />
        </div>
        {files.length > 0 && (
          <ul className="mt-2 space-y-1">
            {files.map((f, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-plum-600 bg-white/60 rounded-lg px-2 py-1">
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-plum-400">{(f.size / 1024 / 1024).toFixed(1)}MB</span>
                <button type="button" onClick={() => removeFile(idx)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={submitting || uploading}
        className="w-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-bold hover:scale-[1.02] transition-transform"
      >
        {uploading ? "Uploading files..." : submitting ? "Submitting..." : "Submit Review ✨"}
      </Button>
    </form>
  );
}