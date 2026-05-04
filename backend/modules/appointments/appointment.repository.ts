import { db } from "@/backend/lib/db";
import { appointments } from "@/backend/db/schema/appointments";
import { eq, and, lt, gt } from "drizzle-orm";
import {
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./appointment.types";

export const appointmentRepository = {
  async create(data: CreateAppointmentInput) {
    const [row] = await db.insert(appointments).values(data).returning();
    return row;
  },

  async getById(id: number) {
    return db.query.appointments.findFirst({
      where: eq(appointments.id, id),
      with: {
        patient: true,
        service: true,
      },
    });
  },
  async getByClinic(clinicId: number) {
    return db.query.appointments.findMany({
      where: eq(appointments.clinicId, clinicId),
      with: {
        patient: true,
        service: true,
      },
    });
  },

  async updateAppointment(id: number, data: UpdateAppointmentInput) {
    const [row] = await db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, id))
      .returning();

    return row;
  },

  async findConflict(clinicId: number, start: string, end: string) {
    return db.query.appointments.findMany({
      where: and(
        eq(appointments.clinicId, clinicId),
        lt(appointments.startTime, end),
        gt(appointments.endTime, start),
      ),
      with: {
        patient: true,
        service: true,
      },
    });
  },

  async cancelAppointment(id: number) {
    const [row] = await db
      .update(appointments)
      .set({
        status: "cancelled",
        isActive: false,
        cancelledAt: new Date(),
      })
      .where(eq(appointments.id, id))
      .returning();

    return row;
  },

  async getAppointmentsByDate(clinicId: number, date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return db.query.appointments.findMany({
      where: (a, { and, gte, lte, eq }) =>
        and(
          eq(a.clinicId, clinicId),
          eq(a.isActive, true),
          gte(a.startTime, startOfDay.toISOString()),
          lte(a.startTime, endOfDay.toISOString()),
        ),
      with: {
        patient: true,
        service: true,
      },
      orderBy: (a, { asc }) => [asc(a.startTime)],
    });
  },
};
