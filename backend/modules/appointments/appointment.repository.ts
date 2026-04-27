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
    const [row] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return row;
  },

  async getByClinic(clinicId: number) {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.clinicId, clinicId));
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
    return db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.clinicId, clinicId),
          lt(appointments.startTime, end),
          gt(appointments.endTime, start),
        ),
      );
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
};
