import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Star, Check, X } from "lucide-react";

export default function ReviewApproval() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.CommissionReview.filter({ status: filter }, "-created_date", 100);
      setReviews(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const approve = async (id) => {
    await base44.entities.CommissionReview.update(id, { status: "approved" });
    load();
  };
  const reject = async (id) => {
    await base44.entities.CommissionReview.update(id, { status: "rejected" });
    load();
  };
  const remove = async (id) => {
    await base44.entities.CommissionReview.delete(id);
    load();
  };

  const tabs = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
      <h1 className="font-display text-3xl font-bold text-plum-900 mb-2">Review Approvals</h1>
      <p className="text-plum-500 mb-8">Approve or reject client reviews before they go live.</p>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === t.key ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white" : "glass text-plum-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-plum-400 text-center py-12">Loading...</div>
      ) : reviews.length === 0 ? (
        <div className="glass rounded-3xl p-8 text-center text-plum-400">No {filter} reviews.</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="glass rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-plum-900">{r.clientName}</span>
                    {r.clientHandle && <span className="text-sm text-pink-500">{r.clientHandle}</span>}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? "fill-pink-500 text-pink-500" : "text-pink-200"} />
                    ))}
                    {r.projectType && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                        {r.projectType}
                      </span>
                    )}
                  </div>
                  <p className="text-plum-700">{r.reviewText}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {r.status !== "approved" && (
                    <Button size="sm" onClick={() => approve(r.id)} className="rounded-full bg-green-500 hover:bg-green-600 text-white">
                      <Check size={16} className="mr-1" /> Approve
                    </Button>
                  )}
                  {r.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => reject(r.id)} className="rounded-full">
                      <X size={16} className="mr-1" /> Reject
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => remove(r.id)} className="rounded-full text-red-500 hover:text-red-600">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}