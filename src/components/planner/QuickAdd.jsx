import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, X, CheckSquare, CalendarDays, Video, Lightbulb, Target } from "lucide-react";

const TABS = [
  { key: "PlannerTask", label: "Task", icon: CheckSquare, entity: "PlannerTask" },
  { key: "PlannerEvent", label: "Event", icon: CalendarDays, entity: "PlannerEvent" },
  { key: "StreamPlan", label: "Stream", icon: Video, entity: "StreamPlan" },
  { key: "PlannerIdea", label: "Idea", icon: Lightbulb, entity: "PlannerIdea" },
  { key: "PlannerGoal", label: "Goal", icon: Target, entity: "PlannerGoal" },
];

const DEFAULTS = {
  PlannerTask: { title: "", status: "todo", priority: "medium" },
  PlannerEvent: { title: "", date: new Date().toISOString(), type: "event", priority: "medium" },
  StreamPlan: { title: "", platform: "Twitch", checklist: [{ label: "OBS ready", done: false }, { label: "Mic checked", done: false }] },
  PlannerIdea: { title: "", category: "Video", status: "new", tags: [] },
  PlannerGoal: { goal: "", status: "active", currentProgress: 0, target: 0 },
};

export default function QuickAdd({ open, onClose, onCreated }) {
  const [tab, setTab] = useState("PlannerTask");
  const [form, setForm] = useState({ ...DEFAULTS.PlannerTask });
  const [saving, setSaving] = useState(false);

  const switchTab = (key) => {
    setTab(key);
    setForm({ ...DEFAULTS[key] });
  };

  const create = async () => {
    const payload = form;
    const hasTitle = !!(payload.title || payload.goal || "").trim();
    if (!hasTitle) return;
    setSaving(true);
    try {
      await base44.entities[tab].create(payload);
      setForm({ ...DEFAULTS[tab] });
      onCreated && onCreated();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  const titleKey = tab === "PlannerGoal" ? "goal" : "title";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
          <h3 className="font-display text-lg font-bold text-plum-900">Quick Add</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-pink-50 text-plum-400"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button key={t.key} onClick={() => switchTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${active ? "bg-pink-500 text-white" : "bg-pink-50 text-plum-600"}`}>
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>
          <div className="space-y-3">
            <input value={form[titleKey] || ""} onChange={(e) => setForm({ ...form, [titleKey]: e.target.value })} placeholder={tab === "PlannerGoal" ? "Goal *" : "Title *"}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" autoFocus />
            {tab === "PlannerTask" && (
              <input type="date" value={form.dueDate || ""} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
            )}
            {tab === "PlannerEvent" && (
              <input type="datetime-local" value={form.date ? form.date.slice(0, 16) : ""} onChange={(e) => setForm({ ...form, date: new Date(e.target.value).toISOString() })} className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
            )}
            {tab === "StreamPlan" && (
              <>
                <input value={form.game || ""} onChange={(e) => setForm({ ...form, game: e.target.value })} placeholder="Game / Category" className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
                <input type="date" value={form.date || ""} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
              </>
            )}
            {tab === "PlannerGoal" && (
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={form.target || 0} onChange={(e) => setForm({ ...form, target: Number(e.target.value) })} placeholder="Target" className="px-4 py-2.5 rounded-xl border border-pink-200" />
                <input type="date" value={form.deadline || ""} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="px-4 py-2.5 rounded-xl border border-pink-200" />
              </div>
            )}
            <button onClick={create} disabled={saving || !(form[titleKey] || "").trim()}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}