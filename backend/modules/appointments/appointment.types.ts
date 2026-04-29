export interface CreateAppointmentInput {
  patientId: number;
  serviceId: number;
  clinicId: number;
  startTime: string;
  endTime: string;
  note: string | null;
  status: "scheduled" | "completed" | "cancelled";
}

export interface Appointment {
  id: number;
  clinicId: number;
  patientId: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  status: "scheduled" | "completed" | "cancelled";
  note: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
}

export type UpdateAppointmentInput = {
  patientId?: number;
  serviceId?: number;
  startTime?: string;
  endTime?: string;
  note: string | null;
  status?: "scheduled" | "completed" | "cancelled";
};

export interface CalendarAppointment {
  id: number;
  clinicId: number;
  patientId: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string | null;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
  };
  service: {
    id: number;
    name: string;
    durationMinutes: number;
    price: number;
  };
}
