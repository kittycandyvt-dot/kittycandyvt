import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Dates that are manually unavailable.
const BLOCKED_DATES = [
  "2026-10-01",
  "2026-10-03",
  "2026-10-07",
  "2026-10-10",
  "2026-10-12",
  "2026-10-16",
  "2026-10-21",
  "2026-10-28",
];

// Interview days:
// Monday, Wednesday, Friday, Saturday
//
// Interview time:
// 10:00 PM
function generateSlots() {
  const slots = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validDays = [1, 3, 5, 6]; // Mon, Wed, Fri, Sat

  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Completely block September and October 2026
    const isSeptember2026 =
      date.getFullYear() === 2026 &&
      date.getMonth() === 8;

    const isOctober2026 =
      date.getFullYear() === 2026 &&
      date.getMonth() === 9;

    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    if (
      validDays.includes(date.getDay()) &&
      !isSeptember2026 &&
      !isOctober2026 &&
      !BLOCKED_DATES.includes(dateString)
    ) {
      const slot = new Date(date);

      // 10:00 PM
      slot.setHours(22, 0, 0, 0);

      slots.push(slot);
    }
  }

  return slots;
}
export default function SlotPicker({
  selectedSlot,
  onSelect,
  bookedSlots = [],
}) {
  // Only exact booked ISO timestamps are considered unavailable.
  const bookedSet = useMemo(() => {
    return new Set(
      bookedSlots.filter(
        (slot) => typeof slot === "string" && slot.includes("T")
      )
    );
  }, [bookedSlots]);

  // Remove already-booked slots.
  const allSlots = useMemo(() => {
    return generateSlots().filter((slot) => {
      return !bookedSet.has(slot.toISOString());
    });
  }, [bookedSet]);

  const months = useMemo(() => {
    const map = {};

    allSlots.forEach((slot) => {
      const key = `${slot.getFullYear()}-${slot.getMonth()}`;

      if (!map[key]) {
        map[key] = {
          label: `${MONTH_NAMES[slot.getMonth()]} ${slot.getFullYear()}`,
          slots: [],
        };
      }

      map[key].slots.push(slot);
    });

    return Object.values(map);
  }, [allSlots]);

  const [monthIndex, setMonthIndex] = useState(0);

  const current = months[monthIndex];

  const formatSlot = (date) => {
    return (
      date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }) +
      " · " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  if (!months.length) {
    return (
      <div className="glass rounded-3xl p-6 md:p-8 text-center">
        <Clock className="mx-auto mb-3 text-pink-400" size={28} />

        <h3 className="font-display text-lg font-bold text-plum-900">
          No interview slots available
        </h3>

        <p className="mt-2 text-sm text-plum-600">
          Please check back later for new interview dates.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() =>
            setMonthIndex((index) => Math.max(0, index - 1))
          }
          disabled={monthIndex === 0}
          className="p-2 rounded-full bg-white border border-pink-200 text-plum-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} />
        </button>

        <h3 className="font-display text-lg font-bold text-plum-900">
          {current?.label}
        </h3>

        <button
          type="button"
          onClick={() =>
            setMonthIndex((index) =>
              Math.min(months.length - 1, index + 1)
            )
          }
          disabled={monthIndex >= months.length - 1}
          className="p-2 rounded-full bg-white border border-pink-200 text-plum-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {current?.slots.map((slot) => {
          const iso = slot.toISOString();

          const isSelected = selectedSlot === iso;

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white border-transparent shadow-md"
                  : "bg-white/70 text-plum-700 border-pink-200 hover:bg-pink-50"
              }`}
            >
              <Clock
                size={15}
                className={
                  isSelected ? "text-white" : "text-pink-400"
                }
              />

              {formatSlot(slot)}
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