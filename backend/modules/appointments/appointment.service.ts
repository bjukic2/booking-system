import { appointmentRepository } from "@/backend/modules/appointments/appointment.repository";
import { patientRepository } from "@/backend/modules/patients/patient.repository";
import { serviceRepository } from "@/backend/modules/services/service.repository";
import { clinicRepository } from "@/backend/modules/clinics/clinic.repository";

import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment.types";

export const appointmentService = {
  async create(data: CreateAppointmentInput) {
    const { clinicId, patientId, serviceId, date } = data;

    // Osnovne provjere
    if (!clinicId) throw new Error("ID klinike je obavezan!");
    if (!patientId) throw new Error("ID pacijenta je obavezan!");
    if (!serviceId) throw new Error("ID usluge je obavezan!");
    if (!date) throw new Error("Datum termina je obavezan!");

    console.log("CLINIC REPO:", clinicRepository);
    // Provjera postoji li klinika
    const clinic = await clinicRepository.getById(clinicId);
    if (!clinic) throw new Error("Klinika ne postoji!");

    //Provjera postoji li pacijent
    const patient = await patientRepository.getById(patientId);
    if (!patient) throw new Error("Pacijent ne postoji!");

    // Provjera postoji li usluga
    const service = await serviceRepository.getById(serviceId);
    if (!service) throw new Error("Usluga ne postoji!");

    // Računanje vremena završetka usluge
    const start = new Date(date);
    const end = new Date(start.getTime() + service.durationMinutes * 60000);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    // Provjeri preklapanja termina
    const conflict = await appointmentRepository.findConflict(
      clinicId,
      startISO,
      endISO,
    );

    if (conflict) {
      throw new Error("Ovaj termin se preklapa s već postojećim terminom!");
    }

    // Napravi termin
    return appointmentRepository.create({
      clinicId,
      patientId,
      serviceId,
      date: startISO,
      endTime: endISO,
    });
  },

  async getById(id: number) {
    const appointment = await appointmentRepository.getById(id);
    if (!appointment) {
      throw new Error("Termin nije pronađen!");
    }
    return appointment;
  },

  async getByClinic(clinicId: number) {
    return appointmentRepository.getByClinic(clinicId);
  },

  async updateAppointment(id: number, data: UpdateAppointmentInput) {
    // Provjeri postoji li termin
    const existing = await appointmentRepository.getById(id);
    if (!existing) {
      throw new Error("Termin ne postoji!");
    }

    // Provjeri postoji li pacijent
    if (data.patientId && data.patientId !== existing.patientId) {
      const patient = await patientRepository.getById(data.patientId);
      if (!patient) {
        throw new Error("Pacijent ne postoji!");
      }
    }

    let service = null;

    if (data.serviceId && data.serviceId !== existing.serviceId) {
      service = await serviceRepository.getById(data.serviceId);
      if (!service) {
        throw new Error("Usluga ne postoji!");
      }
    } else {
      service = await serviceRepository.getById(existing.serviceId);
    }

    // Provjeri konflikt termina
    const startTime = data.date ?? existing.date;

    const end = new Date(startTime);
    end.setMinutes(end.getMinutes() + service.durationMinutes);
    const endTime = end.toISOString();

    if (data.date || data.serviceId) {
      const conflict = await appointmentRepository.findConflict(
        existing.clinicId,
        startTime,
        endTime,
      );

      if (conflict && conflict.id !== id) {
        throw new Error("Termin se preklapa s postojećim!");
      }
    }

    return appointmentRepository.updateAppointment(id, {
      ...data,
      date: startTime,
      endTime,
    });
  },
};
