import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, CalendarDays } from "lucide-react";

export default function StreamsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState("Twitch");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.PlannerStream.list("-streamDate", 100);
      setItems(data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!title || !date) return;
    setSubmitting(true);
    try {
      await base44.entities.PlannerStream.create({ title, streamDate: new Date(date).toISOString(), platform });
      setTitle(""); setDate(""); setPlatform("Twitch");
      await load();
    } finally { setSubmitting(false); }
  };

  const remove = async (id) => {
    await base44.entities.PlannerStream.delete(id);
    setItems(items.filter(i => i.id !== id));
  };

  const fmt = (iso) => new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  return (
    <div>
      <form onSubmit={add} className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-plum-500 mb-1">Stream Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm" placeholder="My next stream..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-plum-500 mb-1">Date & Time</label>
          <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl border border-pink-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-plum-500 mb-1">Platform</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="rounded-xl border border-pink-200 px-3 py-2 text-sm">
            <option>Twitch</option><option>YouTube</option><option>TikTok</option><option>Other</option>
          </select>
        </div>
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-1 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
          <Plus size={16} /> Add
        </button>
      </form>

      {loading ? (
        <p className="text-plum-400 text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-plum-400">
          <CalendarDays size={36} className="mx-auto mb-2 opacity-40" />
          <p>No streams planned yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(s => (
            <div key={s.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <h4 className="font-semibold text-plum-900">{s.title}</h4>
                <p className="text-xs text-pink-500 font-medium mt-0.5">{fmt(s.streamDate)} · {s.platform || "—"}</p>
              </div>
              <button onClick={() => remove(s.id)} className="text-plum-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}