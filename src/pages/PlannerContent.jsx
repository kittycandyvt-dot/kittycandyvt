import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, Clapperboard } from "lucide-react";
import Modal from "@/components/planner/Modal";
import EmptyState from "@/components/planner/EmptyState";

const STATUSES = ["idea", "planning", "recording", "editing", "scheduled", "published"];

export default function PlannerContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", platform: "", contentType: "", idea: "", status: "idea", priority: "medium", plannedDate: "", notes: "" });

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.ContentIdea.list("-created_date");
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await base44.entities.ContentIdea.create(form);
    setForm({ title: "", platform: "", contentType: "", idea: "", status: "idea", priority: "medium", plannedDate: "", notes: "" });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const moveStatus = async (item, dir) => {
    const idx = STATUSES.indexOf(item.status);
    const next = Math.max(0, Math.min(STATUSES.length - 1, idx + dir));
    await base44.entities.ContentIdea.update(item.id, { status: STATUSES[next] });
    load();
  };

  const remove = async (id) => {
    await base44.entities.ContentIdea.delete(id);
    load();
  };

  const columns = STATUSES;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">Content Pipeline</h1>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform">
          <Plus size={18} /> New Idea
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={Clapperboard} title="No content yet" subtitle="Add your first content idea."
          action={<button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500"><Plus size={16} /> New Idea</button>} />
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {columns.map(col => {
            const colItems = items.filter(i => i.status === col);
            return (
              <div key={col} className="min-w-[220px] flex-1 glass rounded-2xl p-3">
                <h3 className="font-semibold text-plum-900 text-sm mb-3 capitalize">{col}</h3>
                <div className="space-y-2">
                  {colItems.map(item => (
                    <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm text-plum-900">{item.title}</p>
                        <button onClick={() => remove(item.id)} className="text-plum-300 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                      {item.platform && <p className="text-xs text-plum-400 mt-1">{item.platform}</p>}
                      <div className="flex gap-1 mt-2">
                        <button onClick={() => moveStatus(item, -1)} className="text-xs px-2 py-1 rounded-full bg-pink-50 text-pink-600 disabled:opacity-30" disabled={col === STATUSES[0]}>←</button>
                        <button onClick={() => moveStatus(item, 1)} className="text-xs px-2 py-1 rounded-full bg-pink-50 text-pink-600 disabled:opacity-30" disabled={col === STATUSES[STATUSES.length - 1]}>→</button>
                      </div>
                    </div>
                  ))}
                  {colItems.length === 0 && <p className="text-xs text-plum-300 py-2">Empty</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Content Idea">
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title *"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <textarea value={form.idea} onChange={(e) => setForm({ ...form, idea: e.target.value })} placeholder="Idea details" rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="Platform"
              className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
            <input value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })} placeholder="Content Type"
              className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="px-4 py-2.5 rounded-xl border border-pink-200 bg-white">
              {["low", "medium", "high"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input type="date" value={form.plannedDate} onChange={(e) => setForm({ ...form, plannedDate: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          </div>
          <button onClick={create} disabled={saving || !form.title.trim()}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
            {saving ? "Saving…" : "Add Idea"}
          </button>
        </div>
      </Modal>
    </div>
  );
}