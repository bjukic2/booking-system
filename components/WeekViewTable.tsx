"use client";

import React from "react";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";

type Props = {
  weekStart: Date; // ponedjeljak
  appointments: CalendarAppointment[];
  onSelectAppointment?: (a: CalendarAppointment) => void;
  selectedDate: Date;
};

export default function WeekViewTable({
  weekStart,
  appointments,
  onSelectAppointment,
}: Props) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  function getMinutesDiff(start: string, end: string) {
    return (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  }

  return (
    <div className="relative border border-gray-300 rounded-lg bg-white overflow-hidden">
      {/* GRID */}
      <div
        className="grid"
        style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
      >
        {/* Empty corner */}
        <div className="border-b border-gray-300"></div>

        {/* Day headers */}
        {days.map((d) => {
          const isToday = d.toDateString() === new Date().toDateString();
          const isSelected = false;

          return (
            <div
              key={d.toISOString()}
              className={`
                p-2 text-center font-semibold border-b border-gray-300
                ${isSelected ? "bg-blue-600 text-white" : ""}
                ${!isSelected && isToday ? "bg-blue-200 text-black" : ""}
                ${!isSelected && !isToday ? "bg-white text-black" : ""}
              `}
            >
              {d.toLocaleDateString("hr-HR", {
                weekday: "short",
                day: "numeric",
                month: "numeric",
              })}
            </div>
          );
        })}

        {/* Hours + columns */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Hour label */}
            <div className="border-b border-gray-300 p-2 text-sm text-gray-700">
              {hour.toString().padStart(2, "0")}:00
            </div>

            {/* 7 day columns */}
            {days.map((d) => (
              <div
                key={d.toISOString() + hour}
                className="relative border-b border-l border-gray-300 h-20 bg-white"
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* APPOINTMENT BLOCKS */}
      {appointments.map((a) => {
        const start = new Date(a.startTime);

        const dayIndex = days.findIndex(
          (d) => d.toDateString() === start.toDateString(),
        );
        if (dayIndex === -1) return null;

        const startHour = start.getHours();
        const startMinutes = start.getMinutes();
        const durationMinutes = getMinutesDiff(a.startTime, a.endTime);

        const topOffset = startHour * 80 + (startMinutes / 60) * 80;
        const height = (durationMinutes / 60) * 80;

        return (
          <div
            key={a.id}
            onClick={() => onSelectAppointment?.(a)}
            className="absolute rounded-md shadow-md p-2 text-sm cursor-pointer overflow-hidden"
            style={{
              left: `calc(80px + ${dayIndex} * (100% / 7))`,
              width: `calc((100% - 80px) / 7 - 6px)`,
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
          </div>
        );
      })}
    </div>
  );
}
