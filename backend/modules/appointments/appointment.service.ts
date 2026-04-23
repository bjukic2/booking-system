import { appointmentRepository } from "./appointment.repository";
import { patientRepository } from "../patients/patient.repository";
import { serviceRepository } from "../services/service.repository";
import { clinicRepository } from "../clinics/clinic.repository";
import { CreateAppointmentInput } from "./appointment.types";

export const appointmentService = {
  async create(data: CreateAppointmentInput) {
    const { clinicId, patientId, serviceId, date } = data;

    // Osnovne provjere
    if (!clinicId) throw new Error("ID klinike je obavezan!");
    if (!patientId) throw new Error("ID pacijenta je obavezan!");
    if (!serviceId) throw new Error("ID usluge je obavezan!");
    if (!date) throw new Error("Datum termina je obavezan!");

    // Provjera postoji li klinika
    const clinic = await clinicRepository.findById(clinicId);
    if (!clinic) throw new Error("Klinika ne postoji!");

    //Provjera postoji li pacijent
    const patient = await patientRepository.findById(patientId);
    if (!patient) throw new Error("Pacijent ne postoji!");

    // Provjera postoji li usluga
    const service = await serviceRepository.findById(serviceId);
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
    });
  },

  async findById(id: number) {
    const appointment = await appointmentRepository.findById(id);
    if (!appointment) {
      throw new Error("Termin nije pronađen!");
    }
    return appointment;
  },

  async findByClinic(clinicId: number) {
    return appointmentRepository.findByClinic(clinicId);
  },
};
