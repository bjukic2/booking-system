import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByDate } from "@/lib/api/appointments";

export function useAppointmentsByDate(date: string) {
  console.log("HOOK → start", date);

  return useQuery({
    queryKey: ["appointments-po-datumu", date],
    queryFn: () => {
      console.log("HOOK → queryFn POKRENUT");
      return getAppointmentsByDate(date);
    },
    enabled: !!date,
  });
}
