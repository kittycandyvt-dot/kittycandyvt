import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, Video } from "lucide-react";
import Modal from "@/components/planner/Modal";
import EmptyState from "@/components/planner/EmptyState";

const DEFAULT_CHECKLIST = [
  { label: "OBS ready", done: false },
  { label: "Mic checked", done: false },
  { label: "VTube Studio checked", done: false },
  { label: "Model checked", done: false },
  { label: "Assets ready", done: false },
  { label: "Title ready", done: false },
  { label: "Thumbnail ready", done: false },
  { label: "Social post ready", done: false },
];

export default function PlannerStreams() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", game: "", date: "", startTime: "", endTime: "", platform: "Twitch", goal: "", notes: "", checklist: DEFAULT_CHECKLIST });

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.StreamPlan.list("-created_date");
    setStreams(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await base44.entities.StreamPlan.create(form);
    setForm({ title: "", game: "", date: "", startTime: "", endTime: "", platform: "Twitch", goal: "", notes: "", checklist: DEFAULT_CHECKLIST });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const toggleCheck = async (stream, idx) => {
    const checklist = (stream.checklist || []).map((c, i) => i === idx ? { ...c, done: !c.done } : c);
    await base44.entities.StreamPlan.update(stream.id, { checklist });
    load();
  };

  const remove = async (id) => {
    await base44.entities.StreamPlan.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">Stream Plans</h1>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform">
          <Plus size={18} /> New Stream
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>
      ) : streams.length === 0 ? (
        <EmptyState icon={Video} title="No streams planned" subtitle="Plan your next stream."
          action={<button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500"><Plus size={16} /> New Stream</button>} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {streams.map(s => (
            <div key={s.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-plum-900">{s.title}</h3>
                  <p className="text-sm text-plum-500">{s.game} · {s.date} {s.startTime}</p>
                </div>
                <button onClick={() => remove(s.id)} className="text-plum-300 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
              {s.goal && <p className="text-sm text-plum-600 mt-2">🎯 {s.goal}</p>}
              <div className="mt-3 space-y-1">
                {(s.checklist || []).map((c, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm text-plum-700">
                    <input type="checkbox" checked={c.done} onChange={() => toggleCheck(s, i)} className="rounded text-pink-500" />
                    <span className={c.done ? "line-through text-plum-400" : ""}>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Stream Plan">
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Stream title *"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <input value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} placeholder="Game / Category"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <div className="grid grid-cols-3 gap-2">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded-xl border border-pink-200" />
            <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="px-3 py-2 rounded-xl border border-pink-200" />
            <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="px-3 py-2 rounded-xl border border-pink-200" />
          </div>
          <input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="Platform"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <input value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} placeholder="Stream goal"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <button onClick={create} disabled={saving || !form.title.trim()}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
            {saving ? "Saving…" : "Add Stream"}
          </button>
        </div>
      </Modal>
    </div>
  );
}