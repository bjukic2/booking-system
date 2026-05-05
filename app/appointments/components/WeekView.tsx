"use client";

import { useMemo } from "react";

function normalize(date: string) {
  return new Date(date).toISOString().split("T")[0];
}

export function WeekView({
  date,
  onSelectDate,
}: {
  date: string;
  onSelectDate: (d: string) => void;
}) {
  const days = useMemo(() => {
    // Ako je datum invalid → vrati prazan array
    if (!date || isNaN(new Date(date).getTime())) {
      return [];
    }

    const base = new Date(date);
    const day = base.getDay(); // 0 = nedjelja
    const mondayOffset = day === 0 ? -6 : 1 - day;

    const monday = new Date(base);
    monday.setDate(base.getDate() + mondayOffset);

    const arr: string[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      arr.push(normalize(d.toISOString()));
    }

    return arr;
  }, [date]);

  // Ako je array prazan → ništa ne prikazuj
  if (days.length === 0) return null;

  return (
    <div className="grid grid-cols-7 gap-2 mt-6">
      {days.map((d) => (
        <button
          key={d}
          onClick={() => onSelectDate(d)}
          className={`p-3 rounded border text-sm ${
            d === date
              ? "bg-blue-600 text-black border-blue-700"
              : "bg-white hover:bg-gray-100 text-black"
          }`}
        >
          {new Date(d).toLocaleDateString("hr-HR", {
            weekday: "short",
            day: "numeric",
            month: "numeric",
          })}
        </button>
      ))}
    </div>
  );
}
