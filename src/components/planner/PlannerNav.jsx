import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, X, Home, Search, Shield, Menu } from "lucide-react";

const GROUPS = [
  {
    label: "Plan",
    items: [
      { to: "/planner/dashboard", label: "Home" },
      { to: "/planner/calendar", label: "Calendar" },
      { to: "/planner/search", label: "Search" },
    ],
  },
  {
    label: "Create",
    items: [
      { to: "/planner/twitch", label: "Twitch" },
      { to: "/planner/streams", label: "Stream Planner" },
      { to: "/planner/youtube", label: "YouTube" },
      { to: "/planner/shorts", label: "TikTok / Shorts" },
      { to: "/planner/twitter", label: "Twitter / X" },
      { to: "/planner/content", label: "Content Ideas" },
    ],
  },
  {
    label: "Business",
    items: [
      { to: "/planner/commissions", label: "Commissions" },
      { to: "/planner/money", label: "Money Tracker" },
      { to: "/planner/collabs", label: "Collabs" },
      { to: "/planner/merch", label: "Merch" },
      { to: "/planner/assets", label: "Asset Library" },
    ],
  },
  {
    label: "Grow",
    items: [
      { to: "/planner/brand", label: "Brand Bible" },
      { to: "/planner/growth", label: "Growth Tracker" },
      { to: "/planner/ideas", label: "Ideas" },
      { to: "/planner/customize", label: "Customize" },
      { to: "/planner/settings", label: "Settings" },
    ],
  },
];

export default function PlannerNav({ isAdmin }) {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setOpenGroup(null); setMobileOpen(false); }, [location.pathname]);

  const isActive = (to) => location.pathname === to || (to !== "/planner/dashboard" && location.pathname.startsWith(to));
  const groupActive = (items) => items.some(i => isActive(i.to));

  return (
    <>
      {/* Desktop nav with category dropdowns */}
      <nav className="hidden md:flex items-center gap-1" ref={dropdownRef}>
        {GROUPS.map(g => (
          <div key={g.label} className="relative">
            <button
              onClick={() => setOpenGroup(openGroup === g.label ? null : g.label)}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${groupActive(g.items) ? "text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              {g.label} <ChevronDown size={14} className={`transition-transform ${openGroup === g.label ? "rotate-180" : ""}`} />
            </button>
            {openGroup === g.label && (
              <div className="absolute top-full right-0 mt-1 min-w-[180px] bg-white rounded-2xl shadow-xl border border-pink-100 py-1.5 z-50">
                {g.items.map(item => (
                  <Link key={item.to} to={item.to}
                    className={`block px-4 py-2 text-sm transition-colors ${isActive(item.to) ? "bg-pink-50 text-primary font-medium" : "text-plum-700 hover:bg-pink-50"}`}>
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {isAdmin && (
          <Link to="/planner/admin" className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium ${isActive("/planner/admin") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <Shield size={16} />
          </Link>
        )}
      </nav>

      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-full text-muted-foreground hover:bg-muted">
        <Menu size={22} />
      </button>

      {/* Mobile slide-out menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-72 max-w-[80vw] bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100 sticky top-0 bg-white z-10">
              <span className="font-display font-bold text-plum-900">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-pink-50 text-plum-400"><X size={18} /></button>
            </div>
            <div className="p-3 space-y-4">
              {GROUPS.map(g => (
                <div key={g.label}>
                  <p className="text-xs font-bold uppercase tracking-wide text-plum-300 px-3 mb-1">{g.label}</p>
                  <div className="space-y-0.5">
                    {g.items.map(item => (
                      <Link key={item.to} to={item.to}
                        className={`block px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive(item.to) ? "bg-primary text-primary-foreground font-medium" : "text-plum-700 hover:bg-pink-50"}`}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {isAdmin && (
                <Link to="/planner/admin" className={`block px-3 py-2.5 rounded-xl text-sm ${isActive("/planner/admin") ? "bg-primary text-primary-foreground font-medium" : "text-plum-700 hover:bg-pink-50"}`}>
                  Admin Panel
                </Link>
              )}
              <Link to="/" className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-plum-500 hover:bg-pink-50">
                <Home size={14} /> Back to Site
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}