import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Target } from "lucide-react";

export default function GoalsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("followers");
  const [target, setTarget] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.PlannerGoal.list("-updated_date", 100);
      setItems(data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!title || !target) return;
    setSubmitting(true);
    try {
      await base44.entities.PlannerGoal.create({ title, category, target: Number(target), current: 0 });
      setTitle(""); setCategory("followers"); setTarget("");
      await load();
    } finally { setSubmitting(false); }
  };

  const remove = async (id) => {
    await base44.entities.PlannerGoal.delete(id);
    setItems(items.filter(i => i.id !== id));
  };

  const bump = async (item, delta) => {
    const current = Math.max(0, (item.current || 0) + delta);
    await base44.entities.PlannerGoal.update(item.id, { current, completed: current >= item.target });
    setItems(items.map(i => i.id === item.id ? { ...i, current, completed: current >= item.target } : i));
  };

  return (
    <div>
      <form onSubmit={add} className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-plum-500 mb-1">Goal</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm" placeholder="Reach 1k followers..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-plum-500 mb-1">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-xl border border-pink-200 px-3 py-2 text-sm">
            <option value="followers">Followers</option><option value="subs">Subs</option><option value="revenue">Revenue</option><option value="content">Content</option><option value="other">Other</option>
          </select>
        </div>
        <div className="w-24">
          <label className="block text-xs font-semibold text-plum-500 mb-1">Target</label>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm" placeholder="1000" />
        </div>
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-1 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
          <Plus size={16} /> Add
        </button>
      </form>

      {loading ? (
        <p className="text-plum-400 text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-plum-400">
          <Target size={36} className="mx-auto mb-2 opacity-40" />
          <p>No goals set yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(g => {
            const pct = Math.min(100, Math.round(((g.current || 0) / (g.target || 1)) * 100));
            return (
              <div key={g.id} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-semibold text-plum-900">{g.title} {g.completed && "🎉"}</h4>
                    <p className="text-xs text-plum-400 capitalize">{g.category}</p>
                  </div>
                  <button onClick={() => remove(g.id)} className="text-plum-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 rounded-full bg-pink-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-plum-600 whitespace-nowrap">{g.current || 0} / {g.target}</span>
                  <div className="flex gap-1">
                    <button onClick={() => bump(g, -1)} className="w-7 h-7 rounded-lg bg-pink-100 text-pink-600 font-bold hover:bg-pink-200">−</button>
                    <button onClick={() => bump(g, 1)} className="w-7 h-7 rounded-lg bg-pink-500 text-white font-bold hover:bg-pink-600">+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}