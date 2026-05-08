import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByWeek } from "@/lib/api/appointments";

export function useAppointmentsByWeek(start: Date, end: Date) {
  const startStr = start.toLocaleDateString("sv-SE");
  const endStr = end.toLocaleDateString("sv-SE");

  return useQuery({
    queryKey: ["appointments-week", startStr, endStr],
    queryFn: () => getAppointmentsByWeek(startStr, endStr),
    enabled: !!startStr && !!endStr,
  });
}
