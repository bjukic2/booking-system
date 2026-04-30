import { useQuery } from "@tanstack/react-query";
import type { Patient } from "@/backend/modules/patients/patient.types";

export function usePatients() {
  return useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const res = await fetch("/api/patients");
      return (await res.json()) as Patient[];
    },
  });
}
