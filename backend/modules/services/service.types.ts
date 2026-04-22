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
  duration: number;
  price: number;
  createdAt: string;
}
