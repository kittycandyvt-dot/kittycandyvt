import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, TrendingUp } from "lucide-react";
import Modal from "@/components/planner/Modal";
import EmptyState from "@/components/planner/EmptyState";

export default function PlannerGrowth() {
  const [metrics, setMetrics] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMetric, setShowMetric] = useState(false);
  const [showGoal, setShowGoal] = useState(false);
  const [metricForm, setMetricForm] = useState({ platform: "", metric: "", currentValue: 0, previousValue: 0, goal: 0, targetDate: "" });
  const [goalForm, setGoalForm] = useState({ goal: "", category: "", target: 0, currentProgress: 0, deadline: "", status: "active", notes: "" });

  const load = async () => {
    setLoading(true);
    const [m, g] = await Promise.all([base44.entities.GrowthMetric.list(), base44.entities.PlannerGoal.list()]);
    setMetrics(m || []);
    setGoals(g || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const createMetric = async () => {
    if (!metricForm.platform || !metricForm.metric) return;
    setSaving(true);
    await base44.entities.GrowthMetric.create(metricForm);
    setMetricForm({ platform: "", metric: "", currentValue: 0, previousValue: 0, goal: 0, targetDate: "" });
    setShowMetric(false);
    setSaving(false);
    load();
  };

  const createGoal = async () => {
    if (!goalForm.goal) return;
    setSaving(true);
    await base44.entities.PlannerGoal.create(goalForm);
    setGoalForm({ goal: "", category: "", target: 0, currentProgress: 0, deadline: "", status: "active", notes: "" });
    setShowGoal(false);
    setSaving(false);
    load();
  };

  const updateProgress = async (goal, delta) => {
    await base44.entities.PlannerGoal.update(goal.id, { currentProgress: Math.max(0, (goal.currentProgress || 0) + delta) });
    load();
  };

  const remove = async (id, entity) => {
    await base44.entities[entity].delete(id);
    load();
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">Growth Tracker</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowGoal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-plum-900 bg-white border border-pink-200"><Plus size={16} /> Goal</button>
          <button onClick={() => setShowMetric(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500"><Plus size={16} /> Metric</button>
        </div>
      </div>

      {/* Metrics */}
      <h2 className="font-bold text-plum-900 mb-3">Metrics</h2>
      {metrics.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No metrics yet" subtitle="Track followers, subscribers and more." />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {metrics.map(m => (
            <div key={m.id} className="glass rounded-2xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-plum-900">{m.platform}</p>
                  <p className="text-xs text-plum-400">{m.metric}</p>
                </div>
                <button onClick={() => remove(m.id, "GrowthMetric")} className="text-plum-300 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
              <p className="text-2xl font-bold text-pink-600 mt-2">{m.currentValue || 0}</p>
              {m.goal > 0 && (
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-pink-100 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500" style={{ width: `${Math.min(100, Math.round(((m.currentValue || 0) / m.goal) * 100))}%` }} />
                  </div>
                  <p className="text-xs text-plum-400 mt-1">Goal: {m.goal}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Goals */}
      <h2 className="font-bold text-plum-900 mb-3">Goals & Milestones</h2>
      {goals.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No goals yet" subtitle="Set your first milestone." />
      ) : (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = g.target > 0 ? Math.min(100, Math.round(((g.currentProgress || 0) / g.target) * 100)) : 0;
            return (
              <div key={g.id} className="glass rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-plum-900">{g.goal}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateProgress(g, -1)} className="w-7 h-7 rounded-full bg-pink-50 text-pink-600">−</button>
                    <span className="text-sm text-plum-600">{g.currentProgress || 0}/{g.target}</span>
                    <button onClick={() => updateProgress(g, 1)} className="w-7 h-7 rounded-full bg-pink-50 text-pink-600">+</button>
                    <button onClick={() => remove(g.id, "PlannerGoal")} className="text-plum-300 hover:text-red-500 ml-1"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="mt-2 h-2 rounded-full bg-pink-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showMetric} onClose={() => setShowMetric(false)} title="New Metric">
        <div className="space-y-3">
          <input value={metricForm.platform} onChange={(e) => setMetricForm({ ...metricForm, platform: e.target.value })} placeholder="Platform (e.g. Twitch)" className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
          <input value={metricForm.metric} onChange={(e) => setMetricForm({ ...metricForm, metric: e.target.value })} placeholder="Metric (e.g. Followers)" className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={metricForm.currentValue || ""} onChange={(e) => setMetricForm({ ...metricForm, currentValue: e.target.value === "" ? 0 : Number(e.target.value) })} placeholder="Current" className="px-4 py-2.5 rounded-xl border border-pink-200" />
            <input type="number" value={metricForm.goal || ""} onChange={(e) => setMetricForm({ ...metricForm, goal: e.target.value === "" ? 0 : Number(e.target.value) })} placeholder="Goal" className="px-4 py-2.5 rounded-xl border border-pink-200" />
          </div>
          <button onClick={createMetric} disabled={saving} className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">{saving ? "Saving…" : "Add Metric"}</button>
        </div>
      </Modal>

      <Modal open={showGoal} onClose={() => setShowGoal(false)} title="New Goal">
        <div className="space-y-3">
          <input value={goalForm.goal} onChange={(e) => setGoalForm({ ...goalForm, goal: e.target.value })} placeholder="Goal * (e.g. Reach 1,000 followers)" className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
          <input value={goalForm.category} onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })} placeholder="Category" className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={goalForm.target || ""} onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value === "" ? 0 : Number(e.target.value) })} placeholder="Target" className="px-4 py-2.5 rounded-xl border border-pink-200" />
            <input type="date" value={goalForm.deadline} onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })} className="px-4 py-2.5 rounded-xl border border-pink-200" />
          </div>
          <button onClick={createGoal} disabled={saving || !goalForm.goal} className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">{saving ? "Saving…" : "Add Goal"}</button>
        </div>
      </Modal>
    </div>
  );
}