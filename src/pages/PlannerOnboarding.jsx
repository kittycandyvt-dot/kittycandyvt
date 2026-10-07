import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Sparkles, Rocket, BookOpen, Loader2 } from "lucide-react";
import { plannerConfig } from "@/data/plannerConfig";

const SAMPLE = {
  PlannerTask: [
    { title: "Edit new VTuber intro video", status: "in_progress", priority: "high", category: "Content", dueDate: new Date().toISOString().slice(0, 10) },
    { title: "Reply to collaboration emails", status: "todo", priority: "medium", category: "Admin" },
    { title: "Design new emote set", status: "todo", priority: "low", category: "Art" },
  ],
  StreamPlan: [
    { title: "Horror Game Marathon", game: "Resident Evil", date: new Date(Date.now() + 86400000).toISOString().slice(0, 10), startTime: "20:00", endTime: "23:00", platform: "Twitch", goal: "Reach 50 viewers", checklist: [{ label: "OBS ready", done: false }, { label: "Mic checked", done: false }, { label: "Thumbnail ready", done: false }] },
  ],
  ContentIdea: [
    { title: "VTuber Q&A video", platform: "YouTube", contentType: "Video", idea: "Answer community questions in character", status: "planning", priority: "medium" },
    { title: "TikTok dance trend", platform: "TikTok", contentType: "Short", idea: "Join the latest dance trend", status: "idea", priority: "low" },
  ],
  PlannerIdea: [
    { title: "Collab with another VTuber", category: "Collaboration", content: "Reach out for a gaming collab stream", tags: ["collab", "stream"], favorite: true, status: "new" },
    { title: "Lore video series", category: "Lore", content: "Expand character backstory across multiple videos", tags: ["lore", "video"], status: "new" },
  ],
  PlannerGoal: [
    { goal: "Reach 1,000 Twitch followers", category: "Growth", target: 1000, currentProgress: 640, status: "active" },
    { goal: "Stream 3 times per week", category: "Schedule", target: 3, currentProgress: 2, status: "active" },
  ],
  GrowthMetric: [
    { platform: "Twitch", metric: "Followers", currentValue: 640, goal: 1000 },
    { platform: "YouTube", metric: "Subscribers", currentValue: 210, goal: 500 },
  ],
  BrandBible: [
    { vtuberName: "Sample VTuber", pronouns: "she/her", tagline: "Spreading sparkle everywhere!", bio: "A cute VTuber who loves gaming and chatting with her community.", personality: "Cheerful, witty and warm", tone: "Friendly and playful" },
  ],
};

export default function PlannerOnboarding({ onDone }) {
  const [loading, setLoading] = useState(false);

  const startFresh = async () => {
    setLoading(true);
    try {
      await base44.entities.UserCustomization.create({
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
    } catch { /* may already exist */ }
    setLoading(false);
    onDone();
  };

  const loadSample = async () => {
    setLoading(true);
    try {
      await startFreshInternal();
      await Promise.all(
        Object.entries(SAMPLE).flatMap(([entity, records]) =>
          records.map(r => base44.entities[entity].create(r))
        )
      );
    } finally {
      setLoading(false);
    }
    onDone();
  };

  const startFreshInternal = async () => {
    try {
      await base44.entities.UserCustomization.create({
        theme: plannerConfig.defaultTheme,
        primaryColor: plannerConfig.defaultColors.primary,
        secondaryColor: plannerConfig.defaultColors.secondary,
        accentColor: plannerConfig.defaultColors.accent,
        backgroundColor: plannerConfig.defaultColors.background,
        textColor: plannerConfig.defaultColors.text,
        font: "Inter, sans-serif",
        cardStyle: "rounded",
        decorations: ["hearts", "sparkles"],
        dashboardWidgets: ["tasks", "streams", "goals", "ideas"],
        defaultView: "month",
        weekStart: "sunday",
        timeFormat: "12h",
      });
    } catch { /* ignore */ }
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="max-w-lg w-full glass rounded-3xl p-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-fuchsia-500 grid place-items-center text-white shadow-lg mb-4">
          <Sparkles size={28} />
        </div>
        <h1 className="font-display text-2xl font-bold text-plum-900">Welcome to {plannerConfig.productName}!</h1>
        <p className="mt-2 text-plum-600">Let's get your planner set up.</p>
        <div className="mt-8 grid gap-3">
          <button onClick={startFresh} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform">
            <Rocket size={18} /> Start Fresh
          </button>
          <button onClick={loadSample} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-plum-900 bg-white border border-pink-200 hover:bg-pink-50 transition-colors">
            <BookOpen size={18} /> Explore Sample Planner
          </button>
        </div>
        <p className="mt-4 text-xs text-plum-400">You can clear sample data anytime from Settings.</p>
      </div>
    </div>
  );
}