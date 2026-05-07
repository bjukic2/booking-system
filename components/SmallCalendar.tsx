"use client";

import { useState, useEffect } from "react";

type Props = {
  selectedDate: Date;
  onSelect: (d: Date) => void;
};

export default function SmallCalendar({ selectedDate, onSelect }: Props) {
  const [ready, setReady] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  if (!ready) return null;

  // HR kratice
  const weekDays = ["Po", "Ut", "Sr", "Če", "Pe", "Su", "Ne"];

  // 1) Prvi dan u mjesecu
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);

  // 2) Koji je dan u tjednu (pon=1, ned=7)
  let startDay = firstDay.getDay(); // 0=ned, 1=pon...
  if (startDay === 0) startDay = 7;

  // 3) Koliko dana iz prošlog mjeseca treba prikazati
  const prevDaysCount = startDay - 1;

  // 4) Zadnji dan u mjesecu
  const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const monthDaysCount = lastDay.getDate();

  // 5) Ukupno 42 polja (6×7)
  const totalCells = 42;

  const days: {
    date: Date;
    isCurrentMonth: boolean;
  }[] = [];

  // 6) Dani iz prošlog mjeseca
  const prevMonthLastDay = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    0,
  ).getDate();
  for (let i = prevDaysCount - 1; i >= 0; i--) {
    const d = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() - 1,
      prevMonthLastDay - i,
    );
    days.push({ date: d, isCurrentMonth: false });
  }

  // 7) Dani trenutnog mjeseca
  for (let i = 1; i <= monthDaysCount; i++) {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
    days.push({ date: d, isCurrentMonth: true });
  }

  // 8) Dani sljedećeg mjeseca
  const nextDaysCount = totalCells - days.length;
  for (let i = 1; i <= nextDaysCount; i++) {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, i);
    days.push({ date: d, isCurrentMonth: false });
  }

  function goPrevMonth() {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() - 1);
    setViewDate(d);
  }

  function goNextMonth() {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + 1);
    setViewDate(d);
  }

  function handleSelect(d: Date, isCurrent: boolean) {
    if (!isCurrent) {
      const newView = new Date(viewDate);

      // Ako je dan manji od 15 → sljedeći mjesec
      // Ako je dan veći od 15 → prošli mjesec
      if (d.getDate() < 15) {
        newView.setMonth(viewDate.getMonth() + 1);
      } else {
        newView.setMonth(viewDate.getMonth() - 1);
      }

      setViewDate(newView);
    }

    onSelect(d);
  }

  return (
    <div className="w-64 p-3 border rounded bg-white shadow-sm select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goPrevMonth}
          className="px-2 py-1 hover:bg-gray-100 rounded text-black cursor-pointer"
        >
          ‹
        </button>

        <div className="font-semibold capitalize text-black">
          {viewDate.toLocaleString("hr-HR", { month: "long", year: "numeric" })}
        </div>

        <button
          onClick={goNextMonth}
          className="px-2 py-1 hover:bg-gray-100 rounded text-black cursor-pointer"
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {weekDays.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 text-sm text-black">
        {days.map(({ date, isCurrentMonth }) => {
          const isSelected =
            date.toDateString() === selectedDate.toDateString();
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleSelect(date, isCurrentMonth)}
              className={`
                flex items-center justify-center
                w-8 h-8 rounded-md transition
                ${isSelected ? "bg-blue-600 text-white font-semibold cursor-pointer" : ""}
                ${!isSelected && isToday ? "bg-blue-200 text-blue-900 font-semibold border border-blue-400 cursor-pointer" : ""}
                ${!isSelected && !isToday && !isCurrentMonth ? "text-gray-400 hover:bg-gray-100 cursor-pointer" : ""}
                ${!isSelected && !isToday && isCurrentMonth ? "hover:bg-gray-100 cursor-pointer" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
