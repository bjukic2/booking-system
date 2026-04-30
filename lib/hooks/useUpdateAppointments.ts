import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointment } from "../api/appointments";
import { UpdateAppointmentInput } from "@/backend/modules/appointments/appointment.types";

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentInput }) =>
      updateAppointment(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
