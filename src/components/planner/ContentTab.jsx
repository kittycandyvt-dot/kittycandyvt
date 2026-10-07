import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, FileText } from "lucide-react";

const STATUSES = ["idea", "scripting", "recording", "editing", "scheduled", "published"];

export default function ContentTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState("video");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.PlannerContent.list("-updated_date", 100);
      setItems(data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);
    try {
      await base44.entities.PlannerContent.create({ title, contentType });
      setTitle(""); setContentType("video");
      await load();
    } finally { setSubmitting(false); }
  };

  const remove = async (id) => {
    await base44.entities.PlannerContent.delete(id);
    setItems(items.filter(i => i.id !== id));
  };

  const cycleStatus = async (item) => {
    const idx = STATUSES.indexOf(item.status || "idea");
    const next = STATUSES[(idx + 1) % STATUSES.length];
    await base44.entities.PlannerContent.update(item.id, { status: next });
    setItems(items.map(i => i.id === item.id ? { ...i, status: next } : i));
  };

  return (
    <div>
      <form onSubmit={add} className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-plum-500 mb-1">Content Idea</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm" placeholder="New video, short, post..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-plum-500 mb-1">Type</label>
          <select value={contentType} onChange={e => setContentType(e.target.value)} className="rounded-xl border border-pink-200 px-3 py-2 text-sm">
            <option value="video">Video</option><option value="short">Short</option><option value="stream">Stream</option><option value="social">Social</option><option value="other">Other</option>
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
          <FileText size={36} className="mx-auto mb-2 opacity-40" />
          <p>No content ideas yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(c => (
            <div key={c.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold text-plum-900 truncate">{c.title}</h4>
                <p className="text-xs text-plum-400 mt-0.5">{c.contentType}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => cycleStatus(c)} className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-600 hover:bg-pink-200 capitalize transition-colors">
                  {c.status || "idea"}
                </button>
                <button onClick={() => remove(c.id)} className="text-plum-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}