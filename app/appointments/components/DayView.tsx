"use client";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";
import { UpdateAppointmentModule } from "./UpdateAppoinmentsModule";
import { useState } from "react";

function formatTime(time: string) {
  return new Date(time).toLocaleDateString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DayView({
  appointments,
}: {
  appointments: CalendarAppointment[];
}) {
  const [selected, setSelected] = useState<CalendarAppointment | null>(null);

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Dnevni raspored</h1>

        {appointments.length === 0 && (
          <div className="text-center text-gray-500">
            Nema termina za danas.
          </div>
        )}

        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => setSelected(appointment)}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-lg">
                    {appointment.patient.firstName}{" "}
                    {appointment.patient.lastName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {appointment.service.name}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    {formatTime(appointment.startTime)} –{" "}
                    {formatTime(appointment.endTime)}
                  </div>
                  <div
                    className={`
                    text-xs font-semibold px-2 py-1 rounded-full text-white
                    ${appointment.status === "scheduled" ? "bg-blue-500" : ""}
                    ${appointment.status === "completed" ? "bg-green-600" : ""}
                    ${appointment.status === "cancelled" ? "bg-red-500" : ""}
                  `}
                  >
                    {appointment.status}
                  </div>
                </div>
              </div>

              {appointment.note && (
                <div className="mt-2 text-sm text-gray-700 italic">
                  {appointment.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <UpdateAppointmentModule
          appointment={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
