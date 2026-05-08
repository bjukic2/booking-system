import { UpdateAppointmentInput } from "@/backend/modules/appointments/appointment.types";
import { apiFetch } from "./fetcher";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";

export function getAppointments(): Promise<CalendarAppointment[]> {
  return apiFetch("/api/appointments");
}

export function createAppointment(data: {
  patientId: number;
  serviceId: number;
  startTime: string;
}) {
  return apiFetch("/api/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAppointment(id: number, data: UpdateAppointmentInput) {
  return apiFetch(`/api/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function cancelAppointment(id: number) {
  return apiFetch(`/api/appointments/${id}/cancel`, {
    method: "PATCH",
  });
}

export function getAppointmentsByDate(
  date: string,
): Promise<CalendarAppointment[]> {
  return apiFetch(`/api/appointments/by-date?date=${date}`);
}

export function getAppointmentsByWeek(
  start: string,
  end: string,
): Promise<CalendarAppointment[]> {
  return apiFetch(`/api/appointments/by-range?start=${start}&end=${end}`);
}
