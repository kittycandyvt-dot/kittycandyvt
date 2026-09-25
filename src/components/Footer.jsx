import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { site } from "@/data/siteData";
import SocialLinks from "@/components/SocialLinks";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "VTuber", to: "/vtuber" },
  { label: "Voice Acting", to: "/voice-acting" },
  { label: "Commissions", to: "/commissions" },
  { label: "Merch", to: "/merch" },
  { label: "Sponsors", to: "/sponsors" },
  { label: "Interview", to: "/interview-signup" },
  { label: "Contact", to: "/contact" },
  { label: "Terms", to: "/terms" },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-b from-pink-50 to-pink-100/50 border-t border-pink-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl text-plum-900 mb-3">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-fuchsia-500 text-white">
                <Heart size={18} />
              </span>
              {site.vtuberName}
            </div>
            <p className="text-plum-500 text-sm max-w-xs">{site.tagline}</p>
            <p className="mt-3 text-sm text-plum-400">
              <a href={`mailto:${site.email}`} className="hover:text-pink-500">{site.email}</a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-plum-900 mb-3 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {navItems.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-plum-500 hover:text-pink-500">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-plum-900 mb-3 text-sm uppercase tracking-wider">Find Me</h4>
            <SocialLinks />
            <Link
              to="/commissions"
              className="mt-5 inline-flex items-center gap-1 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform"
            >
              ✨ Commission Me
            </Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-plum-400">
          <p>© {new Date().getFullYear()} {site.vtuberName}. All rights reserved.</p>
          <p>Made with 💗</p>
        </div>
      </div>
    </footer>
  );
}