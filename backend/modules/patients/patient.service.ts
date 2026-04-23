import { patientRepository } from "@/backend/modules/patients/patient.repository";
import { CreatePatientInput } from "./patient.types";

export const patientService = {
  async create(data: CreatePatientInput) {
    // Osnovna provjera
    if (!data.firstName || data.firstName.trim().length === 0) {
      throw new Error("Ime je potrebno!");
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      throw new Error("Prezime je potrebno!");
    }

    if (!data.phone || data.phone.trim().length === 0) {
      throw new Error("Broj mobitela je potreban!");
    }

    // Provjera postoji li već taj broj mobitela
    if (data.phone) {
      const existing = await patientRepository.getByPhone(data.phone);
      if (existing) {
        throw new Error("Pacijent s ovim brojem mobitela već postoji!");
      }
    }

    // Stvori novog pacijenta
    return patientRepository.create(data);
  },

  async getById(id: number) {
    const patient = await patientRepository.getById(id);
    if (!patient) {
      throw new Error("Pacijent nije pronađen!");
    }
    return patient;
  },

  async getByPhone(phone: string) {
    return patientRepository.getByPhone(phone);
  },

  async getByClinic(clinicId: number) {
    return patientRepository.getByClinic(clinicId);
  },

  async getAll() {
    return patientRepository.getAll();
  },
};
