export interface CreateAppointmentInput {
  patientId: number;
  serviceId: number;
  clinicId: number;
  date: string;
}

export interface Appointment {
  id: number;
  clinicId: number;
  patientId: number;
  serviceId: number;
  date: string;
  createdAt: string;
}
