import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Save } from "lucide-react";
import { plannerConfig } from "@/data/plannerConfig";

const DECORATIONS = ["cats", "hearts", "stars", "bows", "sparkles", "clouds"];
const FONTS = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "'Plus Jakarta Sans', sans-serif", label: "Plus Jakarta Sans" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Comic Sans MS', cursive", label: "Comic Sans" },
];

export default function PlannerCustomize() {
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.UserCustomization.list();
    if (data && data.length > 0) {
      setRecord(data[0]);
      setForm(data[0]);
    } else {
      setForm({
        theme: plannerConfig.defaultTheme,
        primaryColor: plannerConfig.defaultColors.primary,
        secondaryColor: plannerConfig.defaultColors.secondary,
        accentColor: plannerConfig.defaultColors.accent,
        backgroundColor: plannerConfig.defaultColors.background,
        textColor: plannerConfig.defaultColors.text,
        font: "Inter, sans-serif",
        cardStyle: "rounded",
        decorations: [],
        dashboardWidgets: ["tasks", "streams", "goals", "ideas"],
        defaultView: "month",
        weekStart: "sunday",
        timeFormat: "12h",
      });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (record) {
      await base44.entities.UserCustomization.update(record.id, form);
    } else {
      const created = await base44.entities.UserCustomization.create(form);
      setRecord(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleDecoration = (d) => {
    const decorations = form.decorations || [];
    setForm({ ...form, decorations: decorations.includes(d) ? decorations.filter(x => x !== d) : [...decorations, d] });
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">Customize</h1>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving…" : saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-bold text-plum-900 mb-3">Theme</h2>
          <div className="flex gap-3">
            {["light", "dark"].map(t => (
              <button key={t} onClick={() => setForm({ ...form, theme: t })}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${form.theme === t ? "bg-pink-500 text-white" : "bg-white border border-pink-200 text-plum-600"}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-bold text-plum-900 mb-3">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: "primaryColor", label: "Primary" },
              { key: "secondaryColor", label: "Secondary" },
              { key: "accentColor", label: "Accent" },
              { key: "backgroundColor", label: "Background" },
              { key: "textColor", label: "Text" },
            ].map(c => (
              <div key={c.key}>
                <label className="block text-sm text-plum-600 mb-1">{c.label}</label>
                <input type="color" value={form[c.key] || "#e64a85"} onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                  className="w-full h-10 rounded-xl border border-pink-200" />
              </div>
            ))}
          </div>
        </div>

        {/* Font */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-bold text-plum-900 mb-3">Typography</h2>
          <select value={form.font} onChange={(e) => setForm({ ...form, font: e.target.value })} className="px-4 py-2.5 rounded-xl border border-pink-200 bg-white">
            {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>

        {/* Card style */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-bold text-plum-900 mb-3">Card Style</h2>
          <div className="flex gap-3">
            {["rounded", "soft", "minimal"].map(s => (
              <button key={s} onClick={() => setForm({ ...form, cardStyle: s })}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${form.cardStyle === s ? "bg-pink-500 text-white" : "bg-white border border-pink-200 text-plum-600"}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Decorations */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-bold text-plum-900 mb-3">Decorations (optional)</h2>
          <div className="flex flex-wrap gap-2">
            {DECORATIONS.map(d => {
              const active = (form.decorations || []).includes(d);
              return (
                <button key={d} onClick={() => toggleDecoration(d)}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize ${active ? "bg-pink-500 text-white" : "bg-white border border-pink-200 text-plum-600"}`}>{d}</button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}