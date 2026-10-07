import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, Lightbulb, Star } from "lucide-react";
import Modal from "@/components/planner/Modal";
import EmptyState from "@/components/planner/EmptyState";

export default function PlannerIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Video", content: "", tags: [], favorite: false, status: "new", notes: "" });
  const [tagInput, setTagInput] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.PlannerIdea.list("-created_date");
    setIdeas(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    await base44.entities.PlannerIdea.create(form);
    setForm({ title: "", category: "Video", content: "", tags: [], favorite: false, status: "new", notes: "" });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const toggleFav = async (idea) => {
    await base44.entities.PlannerIdea.update(idea.id, { favorite: !idea.favorite });
    load();
  };

  const remove = async (id) => {
    await base44.entities.PlannerIdea.delete(id);
    load();
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const filtered = ideas.filter(i => !search || i.title.toLowerCase().includes(search.toLowerCase()) || (i.content || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">Idea Vault</h1>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500"><Plus size={18} /> New Idea</button>
      </div>

      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ideas…" className="w-full mb-4 px-4 py-2 rounded-full border border-pink-200 bg-white/70 text-sm focus:outline-none focus:border-pink-400" />

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Lightbulb} title="No ideas yet" subtitle="Capture your next big idea."
          action={<button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500"><Plus size={16} /> New Idea</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(i => (
            <div key={i.id} className="glass rounded-2xl p-4 relative">
              <button onClick={() => toggleFav(i)} className="absolute top-3 right-3 text-plum-300">
                <Star size={18} className={i.favorite ? "fill-yellow-400 text-yellow-400" : ""} />
              </button>
              <h3 className="font-semibold text-plum-900 pr-6">{i.title}</h3>
              {i.category && <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 mt-1">{i.category}</span>}
              {i.content && <p className="text-sm text-plum-500 mt-2 line-clamp-3">{i.content}</p>}
              {i.tags && i.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {i.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-600">#{t}</span>)}
                </div>
              )}
              <button onClick={() => remove(i.id)} className="mt-3 text-xs text-plum-300 hover:text-red-500"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Idea">
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title *" className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Idea details" rows={3} className="w-full px-4 py-2.5 rounded-xl border border-pink-200" />
          <div className="flex gap-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag" className="flex-1 px-4 py-2 rounded-xl border border-pink-200" />
            <button onClick={addTag} className="px-3 py-2 rounded-xl bg-pink-100 text-pink-600">Add</button>
          </div>
          <div className="flex flex-wrap gap-1">
            {form.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-50 text-fuchsia-600">#{t}</span>)}
          </div>
          <button onClick={create} disabled={saving || !form.title.trim()} className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">{saving ? "Saving…" : "Add Idea"}</button>
        </div>
      </Modal>
    </div>
  );
}