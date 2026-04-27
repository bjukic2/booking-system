export interface CreateClinicInput {
  name: string;
  domain: string;
  address?: string;
  phone: string;
}

export interface Clinic {
  id: number;
  name: string;
  domain: string;
  address: string | null;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;
}

export interface UpdateClinicInput {
  name?: string;
  phone?: string;
  address?: string;
}
