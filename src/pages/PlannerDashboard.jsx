import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { CheckSquare, CalendarDays, Video, Target, Lightbulb, Plus, ArrowRight } from "lucide-react";
import EmptyState from "@/components/planner/EmptyState";

export default function PlannerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [streams, setStreams] = useState([]);
  const [goals, setGoals] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [t, e, s, g, i] = await Promise.all([
          base44.entities.PlannerTask.list(),
          base44.entities.PlannerEvent.list(),
          base44.entities.StreamPlan.list(),
          base44.entities.PlannerGoal.list(),
          base44.entities.PlannerIdea.list(),
        ]);
        setTasks(t || []);
        setEvents(e || []);
        setStreams(s || []);
        setGoals(g || []);
        setIdeas(i || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaysTasks = tasks.filter(t => t.dueDate === today);
  const upcomingStreams = streams.filter(s => s.date && s.date >= today)
    .sort((a, b) => new Date(`${a.date}T${a.startTime || "00:00"}`) - new Date(`${b.date}T${b.startTime || "00:00"}`))
    .slice(0, 5);
  const activeGoals = goals.filter(g => g.status === "active").slice(0, 4);
  const recentIdeas = ideas.slice(0, 4);
  const inProgressContent = [];

  if (loading) {
    return <div className="py-20 text-center text-plum-400">Loading your planner…</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-plum-900">Dashboard</h1>
        <Link to="/planner/tasks" className="text-sm font-medium text-pink-500 hover:underline">View all</Link>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Today's tasks */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={18} className="text-pink-500" />
            <h2 className="font-bold text-plum-900">Today's Tasks</h2>
          </div>
          {todaysTasks.length === 0 ? (
            <p className="text-sm text-plum-400">No tasks due today.</p>
          ) : (
            <ul className="space-y-2">
              {todaysTasks.map(t => (
                <li key={t.id} className="flex items-center gap-2 text-sm text-plum-700">
                  <span className={`w-2 h-2 rounded-full ${t.status === "done" ? "bg-green-400" : "bg-pink-400"}`} />
                  {t.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming streams */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Video size={18} className="text-pink-500" />
            <h2 className="font-bold text-plum-900">Upcoming Streams</h2>
          </div>
          {upcomingStreams.length === 0 ? (
            <p className="text-sm text-plum-400">No streams scheduled.</p>
          ) : (
            <ul className="space-y-2">
              {upcomingStreams.map(s => (
                <li key={s.id} className="text-sm text-plum-700">
                  <span className="font-medium">{s.title}</span>
                  <span className="text-plum-400"> · {s.date}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Active goals */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-pink-500" />
            <h2 className="font-bold text-plum-900">Current Goals</h2>
          </div>
          {activeGoals.length === 0 ? (
            <p className="text-sm text-plum-400">No active goals.</p>
          ) : (
            <ul className="space-y-3">
              {activeGoals.map(g => {
                const pct = g.target > 0 ? Math.min(100, Math.round((g.currentProgress / g.target) * 100)) : 0;
                return (
                  <li key={g.id}>
                    <div className="flex justify-between text-sm">
                      <span className="text-plum-700 font-medium">{g.goal}</span>
                      <span className="text-plum-400">{pct}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-pink-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent ideas */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={18} className="text-pink-500" />
            <h2 className="font-bold text-plum-900">Recent Ideas</h2>
          </div>
          {recentIdeas.length === 0 ? (
            <p className="text-sm text-plum-400">No ideas yet.</p>
          ) : (
            <ul className="space-y-2">
              {recentIdeas.map(i => (
                <li key={i.id} className="text-sm text-plum-700">{i.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { to: "/planner/tasks", label: "Tasks", icon: CheckSquare },
          { to: "/planner/content", label: "Content", icon: CalendarDays },
          { to: "/planner/ideas", label: "Ideas", icon: Lightbulb },
          { to: "/planner/growth", label: "Goals", icon: Target },
        ].map(l => {
          const Icon = l.icon;
          return (
            <Link key={l.to} to={l.to} className="glass rounded-2xl p-4 flex items-center gap-2 text-plum-700 hover:bg-pink-50 transition-colors">
              <Icon size={18} className="text-pink-500" /> {l.label} <ArrowRight size={14} className="ml-auto" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}