import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TORONTO_TZ = "America/Toronto";

const toTorontoDateStr = (date) => {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date(date));
};

const toTorontoDateTimeLocal = (date) => {
  if (!date) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_TZ,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date(date));
  const get = (t) => parts.find(p => p.type === t)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
};

export default function PlannerCalendar() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [streams, setStreams] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState("month");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", date: "", type: "event", priority: "medium", notes: "" });
  const [editItem, setEditItem] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const ENTITY_MAP = {
    event: "PlannerEvent",
    task: "PlannerTask",
    stream: "StreamPlan",
    content: "ContentIdea",
  };

  const reload = async () => {
    const [e, t, s, c] = await Promise.all([
      base44.entities.PlannerEvent.list(),
      base44.entities.PlannerTask.list(),
      base44.entities.StreamPlan.list(),
      base44.entities.ContentIdea.list(),
    ]);
    setEvents(e || []);
    setTasks(t || []);
    setStreams(s || []);
    setContent(c || []);
  };

  const openEdit = (item) => {
    setEditItem({ ...item });
  };

  const saveEdit = async () => {
    if (!editItem) return;
    setEditSaving(true);
    try {
      const entity = ENTITY_MAP[editItem._type];
      const { id, _type, _date, _label, created_date, updated_date, created_by_id, ...rest } = editItem;
      if (editItem._type === "event" && rest.date) {
        rest.date = new Date(rest.date).toISOString();
      }
      await base44.entities[entity].update(editItem.id, rest);
      await reload();
      setEditItem(null);
    } finally {
      setEditSaving(false);
    }
  };

  const deleteEdit = async () => {
    if (!editItem) return;
    setEditSaving(true);
    try {
      const entity = ENTITY_MAP[editItem._type];
      await base44.entities[entity].delete(editItem.id);
      await reload();
      setEditItem(null);
    } finally {
      setEditSaving(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [e, t, s, c] = await Promise.all([
          base44.entities.PlannerEvent.list(),
          base44.entities.PlannerTask.list(),
          base44.entities.StreamPlan.list(),
          base44.entities.ContentIdea.list(),
        ]);
        setEvents(e || []);
        setTasks(t || []);
        setStreams(s || []);
        setContent(c || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allItems = useMemo(() => {
    return [
      ...events.map(x => ({ ...x, _date: toTorontoDateStr(x.date), _type: "event", _label: x.title })),
      ...tasks.map(x => ({ ...x, _date: x.dueDate || null, _type: "task", _label: x.title })),
      ...streams.map(x => ({ ...x, _date: x.date || null, _type: "stream", _label: x.title })),
      ...content.map(x => ({ ...x, _date: x.plannedDate || null, _type: "content", _label: x.title })),
    ].filter(x => x._date);
  }, [events, tasks, streams, content]);

  const typeColor = {
    event: "bg-purple-100 text-purple-600",
    task: "bg-pink-100 text-pink-600",
    stream: "bg-red-100 text-red-600",
    content: "bg-amber-100 text-amber-600",
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>;

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => setCursor(new Date(year, month - 1, 1));
  const next = () => setCursor(new Date(year, month + 1, 1));

  const openForm = () => {
    setEventForm({ title: "", date: "", type: "event", priority: "medium", notes: "" });
    setShowForm(true);
  };

  const saveEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.date) return;
    setSaving(true);
    try {
      await base44.entities.PlannerEvent.create({ ...eventForm, date: new Date(eventForm.date).toISOString() });
      setEvents([...events, { ...eventForm, date: new Date(eventForm.date).toISOString() }]);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const todayStr = toTorontoDateStr(new Date());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">{MONTHS[month]} {year}</h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 mr-2">
            {["month", "week", "day"].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${view === v ? "bg-pink-500 text-white" : "bg-white border border-pink-200 text-plum-600"}`}>{v}</button>
            ))}
          </div>
          <button onClick={prev} className="p-2 rounded-full bg-white border border-pink-200"><ChevronLeft size={16} /></button>
          <button onClick={() => setCursor(new Date())} className="px-3 py-1.5 rounded-full text-xs font-medium text-plum-600 bg-white border border-pink-200">Today</button>
          <button onClick={next} className="p-2 rounded-full bg-white border border-pink-200"><ChevronRight size={16} /></button>
          <button onClick={openForm} className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-sm hover:scale-105 transition-transform">
            <Plus size={16} /> Add Event
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
              <h3 className="font-display text-lg font-bold text-plum-900">New Event</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-pink-50 text-plum-400"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="Event title *" autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
              <div className="grid grid-cols-2 gap-3">
                <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400">
                  <option value="event">Event</option>
                  <option value="stream">Stream</option>
                  <option value="upload">Upload</option>
                  <option value="content">Content</option>
                  <option value="goal">Goal</option>
                  <option value="important">Important</option>
                </select>
                <select value={eventForm.priority} onChange={(e) => setEventForm({ ...eventForm, priority: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <input type="datetime-local" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
              <textarea value={eventForm.notes} onChange={(e) => setEventForm({ ...eventForm, notes: e.target.value })} placeholder="Notes" rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
              <button onClick={saveEvent} disabled={saving || !eventForm.title.trim() || !eventForm.date}
                className="w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">
                {saving ? "Saving…" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === "month" && (
        <div className="glass rounded-2xl p-3 overflow-x-auto">
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DOW.map(d => <div key={d} className="text-center text-xs font-semibold text-plum-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayItems = allItems.filter(x => x._date === dateStr);
              const isToday = dateStr === todayStr;
              return (
                <div key={day} className={`min-h-[80px] p-1.5 rounded-xl border ${isToday ? "border-pink-400 bg-pink-50" : "border-pink-100 bg-white/50"}`}>
                  <p className={`text-xs font-medium ${isToday ? "text-pink-600" : "text-plum-400"}`}>{day}</p>
                  <div className="space-y-0.5 mt-1">
                    {dayItems.slice(0, 3).map((it, idx) => (
                      <button key={idx} onClick={() => openEdit(it)} className={`w-full text-left text-[10px] px-1 py-0.5 rounded truncate ${typeColor[it._type]} hover:ring-1 hover:ring-pink-300`}>{it._label}</button>
                    ))}
                    {dayItems.length > 3 && <p className="text-[10px] text-plum-400">+{dayItems.length - 3} more</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "week" && (() => {
        const start = new Date(cursor);
        start.setDate(cursor.getDate() - cursor.getDay());
        return (
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(start);
              d.setDate(start.getDate() + i);
              const dateStr = toTorontoDateStr(d);
              const dayItems = allItems.filter(x => x._date === dateStr);
              return (
                <div key={i} className="glass rounded-2xl p-3 min-h-[160px]">
                  <p className="text-xs font-semibold text-plum-500 mb-2">{DOW[i]} {d.getDate()}</p>
                  <div className="space-y-1">
                    {dayItems.map((it, idx) => (
                      <button key={idx} onClick={() => openEdit(it)} className={`w-full text-left text-[10px] px-1.5 py-1 rounded ${typeColor[it._type]} hover:ring-1 hover:ring-pink-300`}>{it._label}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {view === "day" && (() => {
        const dateStr = toTorontoDateStr(cursor);
        const dayItems = allItems.filter(x => x._date === dateStr);
        return (
          <div className="glass rounded-2xl p-5">
            <p className="font-semibold text-plum-900 mb-3">{cursor.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
            {dayItems.length === 0 ? (
              <p className="text-sm text-plum-400">Nothing scheduled.</p>
            ) : (
              <div className="space-y-2">
                {dayItems.map((it, idx) => (
                  <button key={idx} onClick={() => openEdit(it)} className={`w-full text-left text-sm px-3 py-2 rounded-xl ${typeColor[it._type]} hover:ring-1 hover:ring-pink-300`}>{it._label}</button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {Object.entries(typeColor).map(([k, v]) => (
          <span key={k} className={`px-2 py-1 rounded-full capitalize ${v}`}>{k}</span>
        ))}
        <Link to="/planner/tasks" className="ml-auto text-pink-500 hover:underline">Manage tasks →</Link>
      </div>

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setEditItem(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100">
              <h3 className="font-display text-lg font-bold text-plum-900 capitalize">Edit {editItem._type}</h3>
              <button onClick={() => setEditItem(null)} className="p-2 rounded-full hover:bg-pink-50 text-plum-400"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <input value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} placeholder="Title *"
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
              <div className="grid grid-cols-2 gap-3">
                <select value={editItem.type || "event"} onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400">
                  <option value="event">Event</option>
                  <option value="stream">Stream</option>
                  <option value="upload">Upload</option>
                  <option value="content">Content</option>
                  <option value="goal">Goal</option>
                  <option value="important">Important</option>
                </select>
                <select value={editItem.priority || "medium"} onChange={(e) => setEditItem({ ...editItem, priority: e.target.value })}
                  className="px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {editItem._type === "event" ? (
                <input type="datetime-local" value={editItem.date ? toTorontoDateTimeLocal(editItem.date) : ""} onChange={(e) => setEditItem({ ...editItem, date: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
              ) : (
                <input type="date" value={editItem._date || ""} onChange={(e) => setEditItem({ ...editItem, [editItem._type === "task" ? "dueDate" : editItem._type === "content" ? "plannedDate" : "date"]: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
              )}
              <textarea value={editItem.notes || ""} onChange={(e) => setEditItem({ ...editItem, notes: e.target.value })} placeholder="Notes" rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-400" />
              <div className="flex gap-2">
                <button onClick={deleteEdit} disabled={editSaving} className="flex-1 py-2.5 rounded-xl font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 disabled:opacity-50">Delete</button>
                <button onClick={saveEdit} disabled={editSaving || !editItem.title?.trim()} className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 disabled:opacity-50">{editSaving ? "Saving…" : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}