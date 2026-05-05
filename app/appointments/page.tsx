"use client";

import { useState } from "react";
import { DayView } from "./components/DayView";
import { WeekView } from "./components/WeekView";
import { MonthView } from "./components/MonthView";

function normalize(date: string) {
  return new Date(date).toISOString().split("T")[0];
}

export default function AppointmentsPage() {
  const today = normalize(new Date().toISOString());
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState<"week" | "month">("week");

  function goPrevWeek() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 7);
    setSelectedDate(normalize(d.toISOString()));
  }

  function goNextWeek() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 7);
    setSelectedDate(normalize(d.toISOString()));
  }

  function goPrevMonth() {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() - 1);
    setSelectedDate(normalize(d.toISOString()));
  }

  function goNextMonth() {
    const d = new Date(selectedDate);
    d.setMonth(d.getMonth() + 1);
    setSelectedDate(normalize(d.toISOString()));
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setView("week")}
          className={`px-4 py-2 rounded ${
            view === "week"
              ? "bg-blue-600 text-black"
              : "bg-gray-200 text-black"
          }`}
        >
          Week
        </button>

        <button
          onClick={() => setView("month")}
          className={`px-4 py-2 rounded ${
            view === "month"
              ? "bg-blue-600 text-black"
              : "bg-gray-200 text-black"
          }`}
        >
          Month
        </button>
      </div>

      {/* WEEK VIEW */}
      {view === "week" && (
        <>
          {/* Navigacija tjedna */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={goPrevWeek}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
            >
              ← Prethodni tjedan
            </button>

            <button
              onClick={goNextWeek}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
            >
              Sljedeći tjedan →
            </button>
          </div>

          {/* WeekView */}
          <WeekView
            date={selectedDate}
            onSelectDate={(d) => setSelectedDate(normalize(d))}
          />

          {/* DayView ispod */}
          <div className="mt-6">
            <DayView date={selectedDate} />
          </div>
        </>
      )}

      {view === "month" && (
        <>
          {/* Navigacija mjeseca */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={goPrevMonth}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Prethodni mjesec
            </button>

            <div className="text-xl font-semibold">
              {new Date(selectedDate).toLocaleDateString("hr-HR", {
                month: "long",
                year: "numeric",
              })}
            </div>

            <button
              onClick={goNextMonth}
              className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Sljedeći mjesec →
            </button>
          </div>

          <MonthView
            date={selectedDate}
            onSelectDate={(d) => setSelectedDate(normalize(d))}
          />

          <div className="mt-6">
            <DayView date={selectedDate} />
          </div>
        </>
      )}
    </div>
  );
}
