import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Loader2, Pencil } from "lucide-react";
import Modal from "@/components/planner/Modal";
import EmptyState from "@/components/planner/EmptyState";

/**
 * Reusable planner list component.
 * fields: [{ name, label, type, options?, required?, fullWidth?, placeholder? }]
 * displayFields: [field names] to show on each card
 */
export default function GenericPlannerList({ entityName, title, icon: Icon, fields, displayFields, summary }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const blankForm = () => {
    const obj = {};
    fields.forEach(f => {
      obj[f.name] = f.default !== undefined ? f.default : f.type === "boolean" ? false : f.type === "number" ? 0 : "";
    });
    return obj;
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities[entityName].list("-created_date");
      setItems(data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(blankForm()); setShowForm(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setShowForm(true); };

  const save = async () => {
    const required = fields.filter(f => f.required);
    for (const f of required) {
      if (!String(form[f.name] ?? "").trim()) return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { id, created_date, updated_date, created_by_id, _date, _type, _label, ...rest } = form;
        await base44.entities[entityName].update(editing.id, rest);
      } else {
        await base44.entities[entityName].create(form);
      }
      setShowForm(false);
      load();
    } finally { setSaving(false); }
  };

  const remove = async (id) => {
    await base44.entities[entityName].delete(id);
    load();
  };

  const renderField = (f) => {
    const val = form[f.name] ?? "";
    const base = "w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400 text-sm";
    if (f.type === "select") {
      return (
        <select value={val} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={base}>
          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }
    if (f.type === "boolean") {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!val} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} className="w-4 h-4 rounded accent-pink-500" />
          <span className="text-sm text-plum-600">{f.label}</span>
        </label>
      );
    }
    if (f.type === "number") {
      return <input type="number" value={val} onChange={(e) => setForm({ ...form, [f.name]: Number(e.target.value) })} placeholder={f.placeholder || f.label} className={base} />;
    }
    if (f.type === "date") {
      return <input type="date" value={val ? String(val).slice(0, 10) : ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={base} />;
    }
    if (f.type === "datetime") {
      return <input type="datetime-local" value={val ? new Date(val).toISOString().slice(0, 16) : ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className={base} />;
    }
    if (f.type === "textarea") {
      return <textarea value={val} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder || f.label} rows={3} className={base} />;
    }
    return <input type="text" value={val} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder || f.label} className={base} />;
  };

  const getDisplayValue = (item, fname) => {
    const f = fields.find(x => x.name === fname);
    if (!f) return "";
    const val = item[fname];
    if (f.type === "boolean") return val ? "✓ Yes" : "— No";
    if (f.type === "date" && val) return new Date(val).toLocaleDateString();
    if (f.type === "select") {
      const opt = f.options?.find(o => o.value === val);
      return opt?.label || val || "—";
    }
    return val || "—";
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={22} className="text-pink-500" />}
          <h1 className="font-display text-2xl font-bold text-plum-900">{title}</h1>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-sm hover:scale-105 transition-transform">
          <Plus size={16} /> Add
        </button>
      </div>

      {summary && <div className="glass rounded-2xl p-4 mb-4">{summary(items)}</div>}

      {items.length === 0 ? (
        <EmptyState icon={Icon} title={`No ${title.toLowerCase()} yet`} subtitle="Add your first entry to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="glass rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-plum-900 truncate flex-1">{item[displayFields[0]] || "Untitled"}</p>
                <div className="flex gap-1 ml-2 shrink-0">
                  <button onClick={() => openEdit(item)} className="text-plum-300 hover:text-pink-500"><Pencil size={14} /></button>
                  <button onClick={() => remove(item.id)} className="text-plum-300 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="space-y-1">
                {displayFields.slice(1).map(fname => (
                  <div key={fname} className="flex justify-between gap-2 text-xs">
                    <span className="text-plum-400 shrink-0">{fields.find(x => x.name === fname)?.label}:</span>
                    <span className="text-plum-700 text-right truncate">{getDisplayValue(item, fname)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? `Edit ${title}` : `New ${title}`}>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.name} className={f.type === "boolean" ? "" : f.fullWidth ? "" : ""}>
              {f.type !== "boolean" && <label className="block text-xs font-medium text-plum-500 mb-1">{f.label}{f.required && " *"}</label>}
              {renderField(f)}
            </div>
          ))}
          <button onClick={save} disabled={saving} className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
            {saving ? "Saving…" : editing ? "Save Changes" : "Add"}
          </button>
        </div>
      </Modal>
    </div>
  );
}