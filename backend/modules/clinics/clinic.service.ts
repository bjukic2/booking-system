import { clinicRepository } from "@/backend/modules/clinics/clinic.repository";
import { CreateClinicInput, UpdateClinicInput } from "./clinic.types";

export const clinicService = {
  async create(data: CreateClinicInput) {
    // Osnovna provjera
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Ime klinike je potrebno!");
    }

    if (!data.domain || data.domain.trim().length === 0) {
      throw new Error("Domena klinike je potrebna!");
    }

    // Provjeri postoji li već
    const existing = await clinicRepository.getByDomain(data.domain);
    if (existing) {
      throw new Error("Klinika s ovom domenom već postoji!");
    }

    // Stvori novu kliniku
    return clinicRepository.create(data);
  },

  async getById(id: number) {
    const clinic = await clinicRepository.getById(id);
    if (!clinic) {
      throw new Error("Klinika nije pronađena!");
    }
    return clinic;
  },

  async getByDomain(domain: string) {
    const clinic = await clinicRepository.getByDomain(domain);
    if (!clinic) {
      throw new Error("Klinika s ovom domenom ne postoji!");
    }
    return clinic;
  },

  async getAll() {
    return clinicRepository.getAll();
  },

  async updateClinic(id: number, data: UpdateClinicInput) {
    const clinic = await clinicRepository.getById(id);
    if (!clinic) {
      throw new Error("Klinika nije pronađena!");
    }
    return clinicRepository.updateClinic(id, data);
  },

  async deactivateClinic(id: number) {
    const clinic = await clinicRepository.getById(id);
    if (!clinic) {
      throw new Error("Klinika nije pronađena!");
    }
    if (!clinic.isActive) {
      throw new Error("Klinika je već deaktivirana!");
    }
    return clinicRepository.deactivateClinic(id);
  },
};
