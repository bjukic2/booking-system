"use client";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";

function TimeLabels() {
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i);

  return (
    <div className="absolute left-0 top-4 bottom-4 w-16 flex flex-col">
      {hours.map((h) => (
        <div key={h} className="h-15 text-xs text-gray-500"></div>
      ))}
    </div>
  );
}

function calculateTop(startTime: string) {
  const date = new Date(startTime);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const startHour = 8;
  const pixelsPerHour = 60;

  return hours - startHour + pixelsPerHour + (minutes / 60) * pixelsPerHour;
}

function calculateHeight(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const diffMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
  const pixelsPerMinute = 1;

  return diffMinutes * pixelsPerMinute;
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-blue-500";
    case "confirmed":
      return "bg-green-600";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function formatTime(time: string) {
  return new Date(time).toLocaleDateString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AppointmentBlock({
  appointment,
}: {
  appointment: CalendarAppointment;
}) {
  const top = calculateTop(appointment.startTime);
  const height = calculateHeight(appointment.startTime, appointment.endTime);

  const color = getStatusColor(appointment.status);

  return (
    <div
      className={`absolute left-0 right-0 rounded-md text-white p-2 shadow ${color}`}
      style={{
        top,
        height,
      }}
    >
      <div className="font-semibold">
        {appointment.patient.firstName} {appointment.patient.lastName}
      </div>
      <div className="text-sm opacity-90">{appointment.service.name}</div>
      <div className="text-sm opacity-80 mt-1">
        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
      </div>
    </div>
  );
}

export function DayView({
  appointments,
}: {
  appointments: CalendarAppointment[];
}) {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Dnevni raspored</h1>

      {appointments.length === 0 && (
        <div className="text-center text-gray-500">Nema termina za danas.</div>
      )}

      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">
                  {appointment.patient.firstName} {appointment.patient.lastName}
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
                    ${appointment.status === "cancelled" ? "bg-red-500" : ""}
                    ${appointment.status === "confirmed" ? "bg-green-600" : ""}
                    ${appointment.status === "pending" ? "bg-blue-500" : ""}
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
  );
}
