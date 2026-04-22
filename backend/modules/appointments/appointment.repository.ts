import { db } from "@/backend/lib/db";
import { appointments } from "@/backend/db/schema/appointments";
import { services } from "@/backend/db/schema/services";
import { eq, and, lt, gt, sql } from "drizzle-orm";
import { CreateAppointmentInput } from "./appointment.types";

export const appointmentRepository = {
  async create(data: CreateAppointmentInput) {
    const [row] = await db.insert(appointments).values(data).returning();
    return row;
  },

  async findById(id: number) {
    const [row] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return row;
  },

  async findByClinic(clinicId: number) {
    const [row] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.clinicId, clinicId));
    return row;
  },

  async findConflict(clinicId: number, start: string, end: string) {
    const [row] = await db
      .select()
      .from(appointments)
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(
        and(
          eq(appointments.clinicId, clinicId),
          lt(appointments.date, end),
          gt(
            sql`${appointments.date} + services.duration_minutes * interval '1 minute'`,
            start,
          ),
        ),
      );

    return row;
  },
};
