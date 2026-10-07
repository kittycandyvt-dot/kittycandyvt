import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Clapperboard, Palette, TrendingUp, Lightbulb, Settings2, Search, Plus, Home, Shield } from "lucide-react";
import { plannerConfig } from "@/data/plannerConfig";
import { base44 } from "@/api/base44Client";
import QuickAdd from "@/components/planner/QuickAdd";
import { usePlannerTheme } from "@/hooks/usePlannerTheme";

const navItems = [
  { to: "/planner/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/planner/calendar", label: "Planner", icon: CalendarDays },
  { to: "/planner/content", label: "Content", icon: Clapperboard },
  { to: "/planner/brand", label: "Brand", icon: Palette },
  { to: "/planner/growth", label: "Growth", icon: TrendingUp },
  { to: "/planner/ideas", label: "Ideas", icon: Lightbulb },
  { to: "/planner/customize", label: "Customize", icon: Palette },
  { to: "/planner/settings", label: "Settings", icon: Settings2 },
];

const mobileNav = [
  { to: "/planner/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/planner/calendar", label: "Planner", icon: CalendarDays },
  { to: "/planner/content", label: "Content", icon: Clapperboard },
  { to: "/planner/brand", label: "Brand", icon: Palette },
  { to: "/planner/growth", label: "Growth", icon: TrendingUp },
  { to: "/planner/ideas", label: "Ideas", icon: Lightbulb },
  { to: "/planner/customize", label: "Customize", icon: Settings2 },
  { to: "/planner/search", label: "Search", icon: Search },
];

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
      {/* Desktop top nav */}
      <header className="hidden md:flex sticky top-0 z-30 items-center justify-between px-6 h-16 glass border-b border-border">
        <Link to="/planner/dashboard" className="font-display text-lg font-bold text-foreground">
          {plannerConfig.productName}
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
          <Link to="/planner/search" className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium ${location.pathname === "/planner/search" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <Search size={16} />
          </Link>
          {isAdmin && (
            <Link to="/planner/admin" className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium ${location.pathname === "/planner/admin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <Shield size={16} />
            </Link>
          )}
        </nav>
      </header>

      <main className="pb-24 md:pb-8 max-w-6xl mx-auto px-4 md:px-6 py-6">
        <Outlet />
      </main>

      {/* Quick Add FAB */}
      <button onClick={() => setQuickAddOpen(true)}
        className="fixed right-5 bottom-20 md:bottom-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl grid place-items-center hover:scale-110 transition-transform">
        <Plus size={26} />
      </button>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-border flex items-center justify-around px-1 py-1.5 overflow-x-auto">
        {mobileNav.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[9px] font-medium transition-colors whitespace-nowrap ${active ? "text-primary" : "text-muted-foreground"}`}>
              <Icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="md:hidden fixed bottom-16 inset-x-0 flex justify-center pointer-events-none">
        <Link to="/" className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-muted-foreground bg-card/80 border border-border shadow-sm">
          <Home size={14} /> Back to Site
        </Link>
      </div>

      <QuickAdd open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  );
}