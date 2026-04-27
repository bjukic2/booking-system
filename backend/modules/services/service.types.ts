export interface CreateServiceInput {
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  clinicId: number;
}

export interface Service {
  id: number;
  clinicId: number;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deactivatedAt: string | null;
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  durationMinutes?: number;
  price?: number;
}
