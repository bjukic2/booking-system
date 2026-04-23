import { clinicRepository } from "./clinic.repository";
import { CreateClinicInput } from "./clinic.types";

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
    const existing = await clinicRepository.findByDomain(data.domain);
    if (existing) {
      throw new Error("Klinika s ovom domenom već postoji!");
    }

    // Stvori novu kliniku
    return clinicRepository.create(data);
  },

  async getById(id: number) {
    const clinic = await clinicRepository.findById(id);
    if (!clinic) {
      throw new Error("Klinika nije pronađena!");
    }
    return clinic;
  },

  async getByDomain(domain: string) {
    const clinic = await clinicRepository.findByDomain(domain);
    if (!clinic) {
      throw new Error("Klinika s ovom domenom ne postoji!");
    }
    return clinic;
  },

  async getAll() {
    return clinicRepository.getAll();
  },
};
