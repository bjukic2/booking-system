"use client";

import React from "react";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";

type Props = {
  date: Date;
  appointments: CalendarAppointment[];
  onSelectAppointment?: (a: CalendarAppointment) => void;
};

export default function DayViewTable({
  date,
  appointments,
  onSelectAppointment,
}: Props) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  function getMinutesDiff(start: string, end: string) {
    return (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  }

  return (
    <div className="relative border rounded-lg bg-white overflow-hidden">
      {/* GRID */}
      <div className="grid grid-cols-[80px_1fr]">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* LEFT COLUMN — HOURS */}
            <div className="border-b border-gray-200 p-2 text-sm text-gray-600">
              {hour.toString().padStart(2, "0")}:00
            </div>

            {/* RIGHT COLUMN — EMPTY CELLS */}
            <div className="relative border-b border-gray-200 h-20 bg-gray-50" />
          </React.Fragment>
        ))}
      </div>

      {/* APPOINTMENT BLOCKS */}
      {appointments.map((a) => {
        const start = new Date(a.startTime);
        const end = new Date(a.endTime);

        const startHour = start.getHours();
        const startMinutes = start.getMinutes();
        const durationMinutes = getMinutesDiff(a.startTime, a.endTime);

        const topOffset = startHour * 80 + (startMinutes / 60) * 80;
        const height = (durationMinutes / 60) * 80;

        return (
          <div
            key={a.id}
            onClick={() => onSelectAppointment?.(a)}
            className="absolute left-20 right-2 rounded-md shadow-md p-2 text-sm cursor-pointer overflow-hidden"
            style={{
              top: topOffset,
              height,
              backgroundColor:
                a.status === "scheduled"
                  ? "#3b82f6"
                  : a.status === "completed"
                    ? "#16a34a"
                    : "#dc2626",
              color: "white",
            }}
          >
            <div className="font-semibold">
              {a.patient.firstName} {a.patient.lastName}
            </div>
            <div className="text-xs opacity-90">{a.service.name}</div>
            {a.note && (
              <div className="text-xs italic opacity-80 mt-1">{a.note}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
