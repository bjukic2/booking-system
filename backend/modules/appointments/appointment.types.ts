export interface CreateAppointmentInput {
  patientId: number;
  serviceId: number;
  clinicId: number;
  date: string;
  endTime: string;
}

export interface Appointment {
  id: number;
  clinicId: number;
  patientId: number;
  serviceId: number;
  date: string;
  endTime: string;
  createdAt: string;
}

export type UpdateAppointmentInput = Omit<Appointment, "id" | "createdAt">;
