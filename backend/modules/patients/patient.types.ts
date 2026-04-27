export interface CreatePatientInput {
  firstName: string;
  lastName: string;
  clinicId: number;
  phone: string;
  email: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string;
}

export interface UpdatePatientInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string | null;
}
