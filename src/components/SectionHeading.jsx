import React from "react";

export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-2xl mb-10`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-pink-500 mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-plum-900">{title}</h2>
      {subtitle && <p className="mt-3 text-plum-500">{subtitle}</p>}
    </div>
  );
}