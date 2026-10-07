import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Save } from "lucide-react";

const FIELDS = [
  { key: "vtuberName", label: "VTuber Name" },
  { key: "pronouns", label: "Pronouns" },
  { key: "tagline", label: "Tagline" },
  { key: "characterConcept", label: "Character Concept", area: true },
  { key: "personality", label: "Personality", area: true },
  { key: "lore", label: "Lore", area: true },
  { key: "bio", label: "Bio", area: true },
  { key: "primaryColor", label: "Primary Color" },
  { key: "secondaryColor", label: "Secondary Color" },
  { key: "accentColor", label: "Accent Color" },
  { key: "fonts", label: "Fonts" },
  { key: "voicePersonality", label: "Voice Personality", area: true },
  { key: "tone", label: "Tone" },
  { key: "catchphrases", label: "Catchphrases", area: true },
  { key: "wordsUsed", label: "Words I Use", area: true },
  { key: "wordsAvoided", label: "Words I Avoid", area: true },
  { key: "communityTerminology", label: "Community Terminology", area: true },
];

export default function PlannerBrand() {
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.BrandBible.list();
    if (data && data.length > 0) {
      setRecord(data[0]);
      setForm(data[0]);
    } else {
      setForm({ vtuberName: "" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (record) {
      await base44.entities.BrandBible.update(record.id, form);
    } else {
      const created = await base44.entities.BrandBible.create(form);
      setRecord(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">Brand Bible</h1>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
          <Save size={16} /> {saving ? "Saving…" : saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {FIELDS.map(f => (
          <div key={f.key} className={f.area ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium text-plum-700 mb-1">{f.label}</label>
            {f.area ? (
              <textarea value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
            ) : (
              <input value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}