export interface CreatePatientInput {
  fullName: string;
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
