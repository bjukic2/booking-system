import { appointmentRepository } from "@/backend/modules/appointments/appointment.repository";
import { patientRepository } from "@/backend/modules/patients/patient.repository";
import { serviceRepository } from "@/backend/modules/services/service.repository";

import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment.types";

export const appointmentService = {
  async create(data: CreateAppointmentInput) {
    const { clinicId, patientId, serviceId, startTime, note } = data;
    // Osnovne provjere
    if (!clinicId) throw new Error("ID klinike je obavezan!");
    if (!patientId) throw new Error("ID pacijenta je obavezan!");
    if (!serviceId) throw new Error("ID usluge je obavezan!");
    if (!startTime) throw new Error("Datum termina je obavezan!");

    //Provjera postoji li pacijent
    const patient = await patientRepository.getById(patientId);
    if (!patient) throw new Error("Pacijent ne postoji!");

    // Provjera postoji li usluga
    const service = await serviceRepository.getById(serviceId);
    if (!service) throw new Error("Usluga ne postoji!");

    // Računanje vremena završetka usluge
    const start = new Date(startTime);
    const end = new Date(start.getTime() + service.durationMinutes * 60000);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

    // Provjeri preklapanja termina
    const conflicts = await appointmentRepository.findConflict(
      clinicId,
      startISO,
      endISO,
    );

    if (conflicts.length > 0) {
      throw new Error("Ovaj termin se preklapa s već postojećim terminom!");
    }

    // Napravi termin
    return appointmentRepository.create({
      clinicId,
      patientId,
      serviceId,
      startTime: startISO,
      endTime: endISO,
      note: note ?? null,
      status: "scheduled",
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
    const startTime = data.startTime ?? existing.startTime;

    const end = new Date(startTime);
    end.setMinutes(end.getMinutes() + service.durationMinutes);
    const endTime = end.toISOString();

    if (data.startTime || data.serviceId) {
      const conflicts = await appointmentRepository.findConflict(
        existing.clinicId,
        startTime,
        endTime,
      );

      const hasOtherConflict = conflicts.some((c) => c.id !== id);
      if (hasOtherConflict) {
        throw new Error("Termin se preklapa s postojećim!");
      }
    }

    return appointmentRepository.updateAppointment(id, {
      ...data,
      startTime: startTime,
      endTime,
    });
  },

  async cancelAppointment(id: number) {
    const existing = await appointmentRepository.getById(id);
    if (!existing) {
      throw new Error("Termin ne postoji!");
    }

    return appointmentRepository.cancelAppointment(id);
  },
};
