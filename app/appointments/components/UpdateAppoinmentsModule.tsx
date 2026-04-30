"use client";

import { useState } from "react";
import { useUpdateAppointment } from "@/lib/hooks/useUpdateAppointments";
import { useServices } from "@/lib/hooks/useServices";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";

interface Props {
  appointment: CalendarAppointment;
  onClose: () => void;
}

export function UpdateAppointmentModule({ appointment, onClose }: Props) {
  const updateMutation = useUpdateAppointment();
  const { data: services = [] } = useServices();

  const [serviceId, setServiceId] = useState(appointment.serviceId);
  const [status, setStatus] = useState<"scheduled" | "completed" | "cancelled">(
    appointment.status,
  );
  const [note, setNote] = useState(appointment.note ?? "");

  function handleSubmit() {
    updateMutation.mutate(
      {
        id: appointment.id,
        data: {
          patientId: appointment.patientId, // ostaje isti
          serviceId,
          status,
          note,
        },
      },
      { onSuccess: () => onClose() },
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 space-y-5 shadow-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Uredi termin</h2>

        {/* Pacijent - readonly */}
        <div className="p-3 rounded bg-blue-50 border border-blue-200">
          <p className="text-xs text-blue-700">Pacijent</p>
          <p className="font-semibold text-blue-900">
            {appointment.patient.firstName} {appointment.patient.lastName}
          </p>
        </div>

        {/* Usluga */}
        <div>
          <label className="text-sm font-medium">Usluga</label>
          <select
            className="border p-2 w-full rounded bg-white focus:ring-2 focus:ring-blue-500"
            value={serviceId}
            onChange={(e) => setServiceId(Number(e.target.value))}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.durationMinutes} min)
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            className="border p-2 w-full rounded bg-white focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as "scheduled" | "completed" | "cancelled",
              )
            }
          >
            <option value="scheduled">Zakazan</option>
            <option value="completed">Obavljen</option>
            <option value="cancelled">Otkazan</option>
          </select>
        </div>

        {/* Bilješka */}
        <div>
          <label className="text-sm font-medium">Bilješka</label>
          <textarea
            className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Gumbi */}
        <button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          {updateMutation.isPending ? "Spremam..." : "Spremi promjene"}
        </button>

        <button
          onClick={onClose}
          className="text-gray-600 text-sm w-full mt-1 hover:underline"
        >
          Zatvori
        </button>
      </div>
    </div>
  );
}
