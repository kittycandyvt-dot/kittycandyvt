import React from "react";

export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16 px-4">
      {Icon && (
        <div className="mx-auto w-14 h-14 rounded-2xl bg-pink-100 grid place-items-center text-pink-500 mb-4">
          <Icon size={26} />
        </div>
      )}
      <h3 className="font-display text-lg font-bold text-plum-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-plum-500">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}