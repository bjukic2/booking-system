export interface CreateClinicInput {
  name: string;
  domain: string;
  address: string;
  phone: string;
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  createdAt: string;
}
