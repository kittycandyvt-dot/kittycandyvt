import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, LogOut, Trash2, Download, RotateCcw, LifeBuoy } from "lucide-react";
import { plannerConfig } from "@/data/plannerConfig";

export default function PlannerSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setUser(u);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout("/planner");
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const [tasks, content, streams, goals, metrics, ideas, events, brand, custom] = await Promise.all([
        base44.entities.PlannerTask.list(),
        base44.entities.ContentIdea.list(),
        base44.entities.StreamPlan.list(),
        base44.entities.PlannerGoal.list(),
        base44.entities.GrowthMetric.list(),
        base44.entities.PlannerIdea.list(),
        base44.entities.PlannerEvent.list(),
        base44.entities.BrandBible.list(),
        base44.entities.UserCustomization.list(),
      ]);
      const data = { tasks, content, streams, goals, metrics, ideas, events, brand, custom, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vtuber-planner-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const resetPlanner = async () => {
    setResetting(true);
    await Promise.all([
      base44.entities.PlannerTask.deleteMany({}),
      base44.entities.ContentIdea.deleteMany({}),
      base44.entities.StreamPlan.deleteMany({}),
      base44.entities.PlannerGoal.deleteMany({}),
      base44.entities.GrowthMetric.deleteMany({}),
      base44.entities.PlannerIdea.deleteMany({}),
      base44.entities.PlannerEvent.deleteMany({}),
      base44.entities.BrandBible.deleteMany({}),
    ]);
    setResetting(false);
    setConfirmReset(false);
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-plum-900 mb-6">Settings</h1>

      {/* Account */}
      <div className="glass rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-plum-900 mb-3">Account</h2>
        <p className="text-sm text-plum-600">{user?.email}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-plum-900 bg-white border border-pink-200"><LogOut size={16} /> Log Out</button>
        </div>
      </div>

      {/* Data */}
      <div className="glass rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-plum-900 mb-3">Data</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportData} disabled={exporting} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
            <Download size={16} /> {exporting ? "Exporting…" : "Export My Data"}
          </button>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-red-600 bg-red-50 border border-red-100"><RotateCcw size={16} /> Reset Planner</button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600">Are you sure? This deletes everything.</span>
              <button onClick={resetPlanner} disabled={resetting} className="px-3 py-1.5 rounded-full text-sm font-medium text-white bg-red-500 disabled:opacity-50">{resetting ? "Resetting…" : "Yes, Delete All"}</button>
              <button onClick={() => setConfirmReset(false)} className="px-3 py-1.5 rounded-full text-sm text-plum-600 bg-white border border-pink-200">Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* Support */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-bold text-plum-900 mb-3">Support</h2>
        <a href={plannerConfig.supportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-plum-900 bg-white border border-pink-200">
          <LifeBuoy size={16} /> Contact Support
        </a>
        <p className="text-xs text-plum-400 mt-3">{plannerConfig.productName} by {plannerConfig.brandName}</p>
      </div>
    </div>
  );
}