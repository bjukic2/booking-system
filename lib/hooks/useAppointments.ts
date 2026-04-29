import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../api/appointments";
import type { CalendarAppointment } from "@/backend/modules/appointments/appointment.types";

export function useAppointments() {
  return useQuery<CalendarAppointment[]>({
    queryKey: ["appointments"],
    queryFn: getAppointments,
  });
}
