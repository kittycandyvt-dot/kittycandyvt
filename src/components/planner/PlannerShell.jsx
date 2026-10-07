import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Clapperboard, Palette, TrendingUp, Lightbulb, Settings2, Search, Plus, Home, Shield } from "lucide-react";
import { plannerConfig } from "@/data/plannerConfig";
import { base44 } from "@/api/base44Client";
import QuickAdd from "@/components/planner/QuickAdd";

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
  { to: "/planner/ideas", label: "Ideas", icon: Lightbulb },
  { to: "/planner/search", label: "Search", icon: Search },
];

export default function PlannerShell() {
  const location = useLocation();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const u = await base44.auth.me();
        setIsAdmin(u?.role === "admin");
      } catch { /* ignore */ }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-pink-50/40">
      {/* Desktop top nav */}
      <header className="hidden md:flex sticky top-0 z-30 items-center justify-between px-6 h-16 glass border-b border-pink-100">
        <Link to="/planner/dashboard" className="font-display text-lg font-bold text-plum-900">
          {plannerConfig.productName}
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${active ? "bg-pink-500 text-white shadow-sm" : "text-plum-600 hover:bg-pink-100"}`}>
                <Icon size={16} /> {item.label}
              </Link>
            );
          })}
          <Link to="/planner/search" className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium ${location.pathname === "/planner/search" ? "bg-pink-500 text-white" : "text-plum-600 hover:bg-pink-100"}`}>
            <Search size={16} />
          </Link>
          {isAdmin && (
            <Link to="/planner/admin" className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium ${location.pathname === "/planner/admin" ? "bg-pink-500 text-white" : "text-plum-600 hover:bg-pink-100"}`}>
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
        className="fixed right-5 bottom-20 md:bottom-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white shadow-xl grid place-items-center hover:scale-110 transition-transform">
        <Plus size={26} />
      </button>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 glass border-t border-pink-100 flex items-center justify-around px-2 py-1.5">
        {mobileNav.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-medium transition-colors ${active ? "text-pink-600" : "text-plum-400"}`}>
              <Icon size={20} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="md:hidden fixed bottom-16 inset-x-0 flex justify-center pointer-events-none">
        <Link to="/" className="pointer-events-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-plum-600 bg-white/80 border border-pink-100 shadow-sm">
          <Home size={14} /> Back to Site
        </Link>
      </div>

      <QuickAdd open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
    </div>
  );
}