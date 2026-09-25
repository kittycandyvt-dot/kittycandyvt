import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Star } from "lucide-react";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.CommissionReview.filter({ status: "approved" }, "-created_date", 50);
        setReviews(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-3xl p-6 animate-pulse">
            <div className="h-4 w-24 rounded bg-pink-200 mb-3" />
            <div className="h-3 w-full rounded bg-pink-100 mb-2" />
            <div className="h-3 w-2/3 rounded bg-pink-100" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="glass rounded-3xl p-8 text-center text-plum-400">
        No reviews yet — be the first to share your experience! 💕
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {reviews.map((r) => (
        <div key={r.id} className="glass rounded-3xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all">
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < r.rating ? "fill-pink-500 text-pink-500" : "text-pink-200"} />
            ))}
          </div>
          <p className="text-plum-700 leading-relaxed mb-4">"{r.reviewText}"</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-plum-900">{r.clientName}</p>
              {r.clientHandle && <p className="text-sm text-pink-500">{r.clientHandle}</p>}
            </div>
            {r.projectType && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                {r.projectType}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}