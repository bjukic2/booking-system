"use client";

import { useMemo } from "react";

function normalize(date: string | Date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function MonthView({
  date,
  onSelectDate,
}: {
  date: string;
  onSelectDate: (d: string) => void;
}) {
  const days = useMemo(() => {
    const base = new Date(date);
    const baseMonth = base.getMonth();

    const first = new Date(base.getFullYear(), baseMonth, 1);
    const weekday = first.getDay();
    const offsetToMonday = weekday === 0 ? 6 : weekday - 1;

    const start = new Date(first);
    start.setDate(start.getDate() - offsetToMonday);

    const arr = [];
    const today = normalize(new Date());
    const cursor = new Date(start);

    for (let i = 0; i < 42; i++) {
      const iso = normalize(cursor);
      arr.push({
        date: iso,
        inMonth: cursor.getMonth() === baseMonth,
        isToday: iso === today,
        isSunday: cursor.getDay() === 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return arr;
  }, [date]);

  return (
    <div className="grid grid-cols-7 gap-2 mt-6">
      {days.map((d) => (
        <button
          key={d.date}
          onClick={() => onSelectDate(d.date)}
          className={`
            p-3 rounded border text-sm font-medium

            ${d.date === date ? "bg-blue-600 text-white border-blue-700" : ""}

            ${d.isToday && d.date !== date ? "border-red-500 bg-red-400!" : ""}

            ${d.isSunday && d.inMonth && d.date !== date ? "text-red-600" : ""}

            ${
              !d.inMonth && d.date !== date
                ? "bg-gray-100 text-gray-400"
                : d.date !== date
                  ? "bg-white text-black hover:bg-gray-100"
                  : ""
            }
          `}
        >
          {new Date(d.date).getDate()}
        </button>
      ))}
    </div>
  );
}
