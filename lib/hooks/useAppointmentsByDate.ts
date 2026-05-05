import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByDate } from "@/lib/api/appointments";

export function useAppointmentsByDate(date: string) {
  return useQuery({
    queryKey: ["appointments-po-datumu", date],
    queryFn: () => {
      return getAppointmentsByDate(date);
    },
    enabled: !!date,
  });
}
