import { serviceRepository } from "./service.repository";
import { clinicRepository } from "../clinics/clinic.repository";
import { CreateServiceInput } from "./service.types";

export const serviceService = {
  async create(data: CreateServiceInput) {
    // Osnovne provjere
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Naziv usluge je potreban!");
    }

    if (!data.durationMinutes || data.durationMinutes <= 0) {
      throw new Error("Trajanje usluge mora biti više od 0 minuta!");
    }

    if (!data.clinicId) {
      throw new Error("ID klinike je potreban!");
    }

    // Provjera postoji li klinika u koju dodajemo uslugu
    const clinic = await clinicRepository.findById(data.clinicId);
    if (!clinic) {
      throw new Error("Klinika ne postoji");
    }

    // Provjera postoji li već usluga s takvim nazivom
    const existing = await serviceRepository.findByName(
      data.clinicId,
      data.name,
    );
    if (existing) {
      throw new Error("Usluga s ovim imenom već postoji u ovoj klinici!");
    }

    return serviceRepository.create(data);
  },

  async getById(id: number) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new Error("Usluga nije pronađena!");
    }
    return service;
  },

  async getByClinic(clinicId: number) {
    return serviceRepository.findByClinic(clinicId);
  },
};
