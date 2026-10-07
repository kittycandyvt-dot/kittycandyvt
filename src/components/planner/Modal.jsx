import React, { useState } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 sticky top-0 bg-white rounded-t-3xl">
          <h3 className="font-display text-lg font-bold text-plum-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-pink-50 text-plum-400"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}