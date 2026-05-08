"use client";

import { useState, useMemo } from "react";
import SmallCalendar from "@/components/SmallCalendar";
import DayViewTable from "@/components/DayViewTable";
import WeekViewTable from "@/components/WeekViewTable";
import { useAppointmentsByWeek } from "@/lib/hooks/useAppointmentsByWeek";
import { useAppointmentsByDate } from "@/lib/hooks/useAppointmentsByDate";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";

export default function Page() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [view, setView] = useState<"day" | "week">("day");

  // Lokalni ISO format (bez UTC pomaka)
  const isoDate = selectedDate.toLocaleDateString("sv-SE");

  const {
    data: dayAppointments = [],
    isLoading: dayLoading,
    error: dayError,
  } = useAppointmentsByDate(isoDate);

  function getMonday(d: Date) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // nedjelja → -6
    date.setDate(date.getDate() + diff);
    return date;
  }

  const monday = getMonday(selectedDate);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const {
    data: weekAppointments = [],
    isLoading: weekLoading,
    error: weekError,
  } = useAppointmentsByWeek(monday, sunday);

  function goPrev() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (view === "day" ? -1 : -7));
    setSelectedDate(d);
  }

  function goNext() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + (view === "day" ? 1 : 7));
    setSelectedDate(d);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto flex gap-6">
        {/* LEFT SIDE — SMALL CALENDAR */}
        <aside className="w-64">
          <SmallCalendar
            selectedDate={selectedDate}
            onSelect={(d) => setSelectedDate(d)}
          />
        </aside>

        {/* RIGHT SIDE */}
        <section className="flex-1 bg-white rounded-lg shadow p-6">
          {/* VIEW SWITCH + NAVIGATION */}
          <div className="flex items-center justify-between mb-4">
            {/* Day / Week buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setView("day")}
                className={`px-3 py-1 rounded ${
                  view === "day" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Dan
              </button>

              <button
                onClick={() => setView("week")}
                className={`px-3 py-1 rounded ${
                  view === "week" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Tjedan
              </button>
            </div>

            {/* Navigation + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                className="px-2 py-1 rounded hover:bg-gray-100"
              >
                ‹
              </button>

              <h1 className="text-xl font-bold capitalize">
                {view === "day" &&
                  selectedDate.toLocaleDateString("hr-HR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}

                {view === "week" &&
                  `Tjedan od ${getMonday(selectedDate).toLocaleDateString(
                    "hr-HR",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}`}
              </h1>

              <button
                onClick={goNext}
                className="px-2 py-1 rounded hover:bg-gray-100"
              >
                ›
              </button>
            </div>
          </div>

          {/* LOADING / ERROR */}
          {view === "day" && dayLoading && (
            <div className="text-gray-500">Učitavanje termina...</div>
          )}

          {view === "day" && dayError && (
            <div className="text-red-600">Greška pri dohvaćanju termina.</div>
          )}

          {view === "day" && !dayLoading && !dayError && (
            <DayViewTable
              date={selectedDate}
              appointments={dayAppointments as CalendarAppointment[]}
              onSelectAppointment={(a) => console.log("Kliknut termin:", a)}
            />
          )}

          {/* LOADING / ERROR */}
          {view === "week" && weekLoading && (
            <div className="text-gray-500">Učitavanje termina...</div>
          )}

          {view === "week" && weekError && (
            <div className="text-red-600">Greška pri dohvaćanju termina.</div>
          )}

          {view === "week" && !weekLoading && !weekError && (
            <WeekViewTable
              weekStart={monday}
              selectedDate={selectedDate}
              appointments={weekAppointments as CalendarAppointment[]}
              onSelectAppointment={(a) => console.log("Kliknut termin:", a)}
            />
          )}
        </section>
      </div>
    </main>
  );
}
