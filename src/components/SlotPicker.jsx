import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Generate available interview slots for the next 3 months.
// Slots: every Monday, Wednesday, Friday, Saturday at 8:00 PM.
function generateSlots() {
  const slots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validDays = [1, 3, 5, 6]; // Mon, Wed, Fri, Sat

  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (validDays.includes(d.getDay())) {
      const slot = new Date(d);
      slot.setHours(20, 0, 0, 0); // 8:00 PM
      slots.push(slot);
    }
  }
  return slots;
}

export default function SlotPicker({ selectedSlot, onSelect, bookedSlots = [] }) {
  const bookedSet = useMemo(() => new Set(bookedSlots), [bookedSlots]);
  const allSlots = useMemo(() => generateSlots().filter((s) => !bookedSet.has(s.toISOString())), [bookedSet]);
  const months = useMemo(() => {
    const map = {};
    allSlots.forEach((s) => {
      const key = `${s.getFullYear()}-${s.getMonth()}`;
      if (!map[key]) {
        map[key] = {
          label: `${MONTH_NAMES[s.getMonth()]} ${s.getFullYear()}`,
          slots: [],
        };
      }
      map[key].slots.push(s);
    });
    return Object.values(map);
  }, [allSlots]);

  const [monthIndex, setMonthIndex] = useState(0);
  const current = months[monthIndex];

  const formatSlot = (d) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
          disabled={monthIndex === 0}
          className="p-2 rounded-full bg-white border border-pink-200 text-plum-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-display text-lg font-bold text-plum-900">{current?.label}</h3>
        <button
          type="button"
          onClick={() => setMonthIndex((i) => Math.min(months.length - 1, i + 1))}
          disabled={monthIndex >= months.length - 1}
          className="p-2 rounded-full bg-white border border-pink-200 text-plum-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {current?.slots.map((s, idx) => {
          const iso = s.toISOString();
          const isSelected = selectedSlot === iso;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelect(iso)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white border-transparent shadow-md"
                  : "bg-white/70 text-plum-700 border-pink-200 hover:bg-pink-50"
              }`}
            >
              <Clock size={15} className={isSelected ? "text-white" : "text-pink-400"} />
              {formatSlot(s)}
            </button>
          );
        })}
      </div>

      {selectedSlot && (
        <p className="mt-4 text-sm text-pink-600 font-semibold">
          ✓ Selected: {formatSlot(new Date(selectedSlot))}
        </p>
      )}
    </div>
  );
}