import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "@/components/planner/EmptyState";

export default function PlannerSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [all, setAll] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [t, e, s, c, i, g] = await Promise.all([
          base44.entities.PlannerTask.list(),
          base44.entities.PlannerEvent.list(),
          base44.entities.StreamPlan.list(),
          base44.entities.ContentIdea.list(),
          base44.entities.PlannerIdea.list(),
          base44.entities.PlannerGoal.list(),
        ]);
        setAll([
          ...(t || []).map(x => ({ ...x, _label: x.title, _type: "Task", _to: "/planner/tasks" })),
          ...(e || []).map(x => ({ ...x, _label: x.title, _type: "Event", _to: "/planner/calendar" })),
          ...(s || []).map(x => ({ ...x, _label: x.title, _type: "Stream", _to: "/planner/streams" })),
          ...(c || []).map(x => ({ ...x, _label: x.title, _type: "Content", _to: "/planner/content" })),
          ...(i || []).map(x => ({ ...x, _label: x.title, _type: "Idea", _to: "/planner/ideas" })),
          ...(g || []).map(x => ({ ...x, _label: x.goal, _type: "Goal", _to: "/planner/growth" })),
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return all.filter(x => (x._label || "").toLowerCase().includes(q) || (x.notes || x.content || x.description || "").toLowerCase().includes(q));
  }, [query, all]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-plum-900 mb-6">Search</h1>
      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-plum-300" size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your tasks, events, content, ideas…" autoFocus
          className="w-full pl-11 pr-4 py-3 rounded-full border border-pink-200 bg-white/70 focus:outline-none focus:border-pink-400" />
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>
      ) : query.trim() && results.length === 0 ? (
        <EmptyState icon={SearchIcon} title="No results" subtitle="Try a different search term." />
      ) : results.length > 0 ? (
        <div className="space-y-2">
          {results.map((r, idx) => (
            <Link key={idx} to={r._to} className="glass rounded-2xl p-4 flex items-center justify-between hover:bg-pink-50 transition-colors">
              <div>
                <p className="font-medium text-plum-900">{r._label}</p>
                <p className="text-xs text-plum-400">{(r.notes || r.content || r.description || "").slice(0, 80)}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">{r._type}</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchIcon} title="Search your planner" subtitle="Find tasks, events, content, ideas and goals." />
      )}
    </div>
  );
}