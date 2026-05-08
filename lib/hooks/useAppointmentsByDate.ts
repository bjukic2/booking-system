import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByDate } from "@/lib/api/appointments";

export function useAppointmentsByDate(date: string) {
  return useQuery({
    queryKey: ["appointments-by-date", date],
    queryFn: () => getAppointmentsByDate(date),
    enabled: /^\d{4}-\d{2}-\d{2}$/.test(date),
  });
}
