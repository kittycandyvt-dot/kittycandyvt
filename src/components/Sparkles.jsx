import React, { useEffect, useRef, useState } from "react";

// Subtle animated sparkle field — lightweight, no heavy canvas.
export default function Sparkles({ count = 12, className = "" }) {
  const items = Array.from({ length: count });
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {items.map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const delay = (i % 5) * 0.8;
        const dur = 3 + (i % 4);
        const size = 6 + (i % 3) * 4;
        return (
          <span
            key={i}
            className="absolute text-pink-300"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              fontSize: size,
              animation: `sparkle-float ${dur}s ease-in-out ${delay}s infinite`,
            }}
          >
            ✦
          </span>
        );
      })}
    </div>
  );
}