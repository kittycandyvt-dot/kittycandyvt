import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, CheckSquare, Square, Loader2 } from "lucide-react";
import Modal from "@/components/planner/Modal";
import EmptyState from "@/components/planner/EmptyState";

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function PlannerTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", priority: "medium", status: "todo", category: "", notes: "" });

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.PlannerTask.list("-created_date");
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createTask = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await base44.entities.PlannerTask.create(form);
    setForm({ title: "", description: "", dueDate: "", priority: "medium", status: "todo", category: "", notes: "" });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const toggleStatus = async (task) => {
    const next = task.status === "done" ? "todo" : "done";
    await base44.entities.PlannerTask.update(task.id, { status: next });
    load();
  };

  const deleteTask = async (id) => {
    await base44.entities.PlannerTask.delete(id);
    load();
  };

  const filtered = tasks.filter(t => {
    if (filter !== "all" && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">Tasks</h1>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform">
          <Plus size={18} /> Quick Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…"
          className="flex-1 min-w-[150px] px-4 py-2 rounded-full border border-pink-200 bg-white/70 text-sm focus:outline-none focus:border-pink-400" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-full border border-pink-200 bg-white/70 text-sm focus:outline-none">
          <option value="all">All</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks yet" subtitle="Add your first task to get started."
          action={<button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500"><Plus size={16} /> Add Task</button>} />
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className="glass rounded-2xl p-4 flex items-start gap-3">
              <button onClick={() => toggleStatus(t)} className="mt-0.5 text-pink-500">
                {t.status === "done" ? <CheckSquare size={20} /> : <Square size={20} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-plum-900 ${t.status === "done" ? "line-through text-plum-400" : ""}`}>{t.title}</p>
                {t.description && <p className="text-sm text-plum-500 mt-0.5">{t.description}</p>}
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.dueDate && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">{t.dueDate}</span>}
                  {t.category && <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-600">{t.category}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.priority === "high" ? "bg-red-100 text-red-600" : t.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>{t.priority}</span>
                </div>
              </div>
              <button onClick={() => deleteTask(t.id)} className="text-plum-300 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Task">
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title *"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category"
              className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-pink-200 bg-white">
              {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-pink-200 bg-white">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <button onClick={createTask} disabled={saving || !form.title.trim()}
            className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
            {saving ? "Saving…" : "Add Task"}
          </button>
        </div>
      </Modal>
    </div>
  );
}