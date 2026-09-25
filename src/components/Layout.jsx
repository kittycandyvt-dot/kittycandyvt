import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col text-plum-900 overflow-hidden">
      {/* Starry background layer */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {Array.from({ length: 50 }).map((_, i) => {
          const left = (i * 37) % 100;
          const top = (i * 53) % 100;
          const delay = (i % 7) * 0.6;
          const dur = 3 + (i % 4);
          const size = 8 + (i % 3) * 4;
          return (
            <span
              key={i}
              className="absolute text-pink-300 select-none"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                fontSize: size,
                animation: `star-twinkle ${dur}s ease-in-out ${delay}s infinite`,
              }}
            >
              ✦
            </span>
          );
        })}
      </div>
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}