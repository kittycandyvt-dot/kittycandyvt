import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, CheckSquare } from "lucide-react";

export default function TasksTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.PlannerTask.list("-created_date", 100);
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
      await base44.entities.PlannerTask.create({ title, priority, dueDate: dueDate || undefined });
      setTitle(""); setPriority("medium"); setDueDate("");
      await load();
    } finally { setSubmitting(false); }
  };

  const toggle = async (item) => {
    await base44.entities.PlannerTask.update(item.id, { done: !item.done });
    setItems(items.map(i => i.id === item.id ? { ...i, done: !i.done } : i));
  };

  const remove = async (id) => {
    await base44.entities.PlannerTask.delete(id);
    setItems(items.filter(i => i.id !== id));
  };

  const prioColor = { high: "bg-red-100 text-red-600", medium: "bg-amber-100 text-amber-600", low: "bg-emerald-100 text-emerald-600" };

  return (
    <div>
      <form onSubmit={add} className="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-semibold text-plum-500 mb-1">Task</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border border-pink-200 px-3 py-2 text-sm" placeholder="What needs doing?" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-plum-500 mb-1">Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} className="rounded-xl border border-pink-200 px-3 py-2 text-sm">
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-plum-500 mb-1">Due</label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="rounded-xl border border-pink-200 px-3 py-2 text-sm" />
        </div>
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-1 px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
          <Plus size={16} /> Add
        </button>
      </form>

      {loading ? (
        <p className="text-plum-400 text-sm">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-plum-400">
          <CheckSquare size={36} className="mx-auto mb-2 opacity-40" />
          <p>No tasks yet. Add one above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(t => (
            <div key={t.id} className="glass rounded-2xl p-4 flex items-center gap-3">
              <button onClick={() => toggle(t)} className={`w-6 h-6 rounded-md border-2 grid place-items-center shrink-0 ${t.done ? "bg-pink-500 border-pink-500 text-white" : "border-pink-300"}`}>
                {t.done && "✓"}
              </button>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold truncate ${t.done ? "line-through text-plum-300" : "text-plum-900"}`}>{t.title}</h4>
                {t.dueDate && <p className="text-xs text-plum-400 mt-0.5">Due {new Date(t.dueDate).toLocaleDateString()}</p>}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${prioColor[t.priority || "medium"]}`}>{t.priority || "medium"}</span>
              <button onClick={() => remove(t.id)} className="text-plum-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}