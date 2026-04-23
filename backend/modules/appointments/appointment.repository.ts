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
    const [row] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.clinicId, clinicId));
    return row;
  },

  async update(id: number, data: UpdateAppointmentInput) {
    return db
      .update(appointments)
      .set(data)
      .where(eq(appointments.id, id))
      .returning();
  },

  async findConflict(clinicId: number, start: string, end: string) {
    const [row] = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.clinicId, clinicId),
          lt(appointments.date, end),
          gt(appointments.endTime, start),
        ),
      );

    return row;
  },
};
