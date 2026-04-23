export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  clinicId: number;
  phone: string;
  email: string;
}

export interface Patient {
  id: number;
  name: string;
  phone: string;
  email?: string;
  createdAt: string;
}
