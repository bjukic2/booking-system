import { useQuery } from "@tanstack/react-query";
import type { Service } from "@/backend/modules/services/service.types";

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      return (await res.json()) as Service[];
    },
  });
}
