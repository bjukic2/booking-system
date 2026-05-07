"use client";

import { useState, useMemo } from "react";
import SmallCalendar from "@/components/SmallCalendar";
import DayViewTable from "@/components/DayViewTable";
import { useAppointmentsByDate } from "@/lib/hooks/useAppointmentsByDate";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";

export default function Page() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const isoDate = selectedDate.toLocaleDateString("sv-SE");

  const {
    data: appointments = [],
    isLoading,
    error,
  } = useAppointmentsByDate(isoDate);

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

        {/* RIGHT SIDE — DAY VIEW TABLE */}
        <section className="flex-1 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">
            {selectedDate.toLocaleDateString("hr-HR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h1>

          {isLoading && (
            <div className="text-gray-500">Učitavanje termina...</div>
          )}

          {error && (
            <div className="text-red-600">Greška pri dohvaćanju termina.</div>
          )}

          {!isLoading && !error && (
            <DayViewTable
              date={selectedDate}
              appointments={appointments as CalendarAppointment[]}
              onSelectAppointment={(a) => console.log("Kliknut termin:", a)}
            />
          )}
        </section>
      </div>
    </main>
  );
}
