import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlannerCalendar() {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [streams, setStreams] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState("month");

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
      ...events.map(x => ({ ...x, _date: x.date ? x.date.slice(0, 10) : null, _type: "event", _label: x.title })),
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

  const todayStr = new Date().toISOString().slice(0, 10);

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
        </div>
      </div>

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
                      <div key={idx} className={`text-[10px] px-1 py-0.5 rounded truncate ${typeColor[it._type]}`}>{it._label}</div>
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
              const dateStr = d.toISOString().slice(0, 10);
              const dayItems = allItems.filter(x => x._date === dateStr);
              return (
                <div key={i} className="glass rounded-2xl p-3 min-h-[160px]">
                  <p className="text-xs font-semibold text-plum-500 mb-2">{DOW[i]} {d.getDate()}</p>
                  <div className="space-y-1">
                    {dayItems.map((it, idx) => (
                      <div key={idx} className={`text-[10px] px-1.5 py-1 rounded ${typeColor[it._type]}`}>{it._label}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {view === "day" && (() => {
        const dateStr = cursor.toISOString().slice(0, 10);
        const dayItems = allItems.filter(x => x._date === dateStr);
        return (
          <div className="glass rounded-2xl p-5">
            <p className="font-semibold text-plum-900 mb-3">{cursor.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
            {dayItems.length === 0 ? (
              <p className="text-sm text-plum-400">Nothing scheduled.</p>
            ) : (
              <div className="space-y-2">
                {dayItems.map((it, idx) => (
                  <div key={idx} className={`text-sm px-3 py-2 rounded-xl ${typeColor[it._type]}`}>{it._label}</div>
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
    </div>
  );
}