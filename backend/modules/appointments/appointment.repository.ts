import { db } from "@/backend/lib/db";
import { appointments } from "@/backend/db/schema/appointments";
import { eq, and, lt, gt, gte, lte } from "drizzle-orm";
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

  async cancelAppointment(id: number, clinicId: number) {
    const [row] = await db
      .update(appointments)
      .set({
        status: "cancelled",
        isActive: false,
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(appointments.id, id), eq(appointments.clinicId, clinicId)))

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

  async updateAppointmentNote(
    id: number,
    clinicId: number,
    note: string | null,
  ) {
    const [row] = await db
      .update(appointments)
      .set({
        note,
        updatedAt: new Date(),
      })
      .where(and(eq(appointments.id, id), eq(appointments.clinicId, clinicId)))
      .returning();

    return row;
  },

  async findAppointmentByDateRange(clinicId: number, start: Date, end: Date) {
    return db.query.appointments.findMany({
      where: and(
        eq(appointments.clinicId, clinicId),
        eq(appointments.isActive, true),
        gte(appointments.startTime, start.toISOString()),
        lte(appointments.startTime, end.toISOString()),
      ),
      with: {
        patient: true,
        service: true,
      },
      orderBy: (a, { asc }) => [asc(a.startTime)],
    });
  },
};
