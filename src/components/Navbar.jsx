import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { site } from "@/data/siteData";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "VTuber", to: "/vtuber" },
  { label: "Voice Acting", to: "/voice-acting" },
  { label: "Portfolio", to: "/portfolio" },
  { label: "Commissions", to: "/commissions" },
  { label: "Merch", to: "/merch" },
  { label: "Sponsors", to: "/sponsors" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-white/70 backdrop-blur-xl border-b border-pink-100 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-plum-900">
            <span className="grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white">
              <Heart size={16} />
            </span>
            {site.vtuberName}
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? "text-pink-600 bg-pink-50"
                        : "text-plum-600 hover:text-pink-500 hover:bg-pink-50/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/commissions"
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              ✨ Commission Me
            </Link>
            <button
              className="lg:hidden grid place-items-center w-10 h-10 rounded-full bg-pink-50 text-pink-600"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-pink-100 shadow-lg">
          <ul className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-plum-700 hover:bg-pink-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/commissions"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500"
              >
                ✨ Commission Me
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}