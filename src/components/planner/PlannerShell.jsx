import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Plus, Home } from "lucide-react";
import { plannerConfig } from "@/data/plannerConfig";
import { base44 } from "@/api/base44Client";
import QuickAdd from "@/components/planner/QuickAdd";
import PlannerNav from "@/components/planner/PlannerNav";
import { usePlannerTheme } from "@/hooks/usePlannerTheme";

export default function PlannerShell() {
  const location = useLocation();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { themeStyle, dark } = usePlannerTheme();

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setIsAdmin(u?.role === "admin");
      } catch { /* ignore */ }
    })();
  }, []);

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen bg-background`} style={themeStyle}>
      {/* Top nav */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 glass border-b border-border">
        <Link to="/planner/dashboard" className="font-display text-base md:text-lg font-bold text-foreground shrink-0">
          {plannerConfig.productName}
        </Link>
        <PlannerNav isAdmin={isAdmin} />
      </header>

      <main className="pb-8 max-w-6xl mx-auto px-4 md:px-6 py-6">
        <Outlet />
      </main>

      {/* Quick Add FAB */}
      <button onClick={() => setQuickAddOpen(true)}
        className="fixed right-5 bottom-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl grid place-items-center hover:scale-110 transition-transform">
        <Plus size={26} />
      </button>

      <QuickAdd open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  );
}