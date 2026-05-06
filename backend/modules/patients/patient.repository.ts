import { db } from "@/backend/lib/db";
import { patients } from "@/backend/db/schema/patients";
import { eq, ilike, and, or, asc, sql } from "drizzle-orm";
import { CreatePatientInput, UpdatePatientInput } from "./patient.types";

export const patientRepository = {
  async create(data: CreatePatientInput) {
    const [row] = await db.insert(patients).values(data).returning();
    return row;
  },

  async getById(id: number) {
    const [row] = await db.select().from(patients).where(eq(patients.id, id));
    return row;
  },

  async getByEmail(email: string) {
    const [row] = await db
      .select()
      .from(patients)
      .where(eq(patients.email, email));
    return row;
  },

  async getByPhone(phone: string) {
    const [row] = await db
      .select()
      .from(patients)
      .where(eq(patients.phone, phone));
    return row;
  },

  async getByClinic(clinicId: number) {
    return db.select().from(patients).where(eq(patients.clinicId, clinicId));
  },

  async searchPatients(clinicId: number, query: string) {
    return db
      .select()
      .from(patients)
      .where(
        and(
          eq(patients.clinicId, clinicId),
          eq(patients.isActive, true),
          or(
            ilike(patients.firstName, `%${query}%`),
            ilike(patients.lastName, `%${query}%`),
            ilike(patients.phone, `%${query}%`),
          ),
        ),
      );
  },

  async updatePatient(id: number, data: UpdatePatientInput) {
    const [row] = await db
      .update(patients)
      .set(data)
      .where(eq(patients.id, id))
      .returning();

    return row;
  },

  async deactivatePatient(id: number) {
    const [row] = await db
      .update(patients)
      .set({
        isActive: false,
        updatedAt: new Date(),
        deactivatedAt: new Date(),
      })
      .where(eq(patients.id, id))
      .returning();

    return row;
  },

  async getPaginatedPatients(clinicId: number, limit = 20, offset = 0) {
    return await db
      .select()
      .from(patients)
      .where(and(eq(patients.clinicId, clinicId), eq(patients.isActive, true)))
      .orderBy(asc(patients.lastName))
      .limit(limit)
      .offset(offset);
  },

  async countPatients(clinicId: number) {
    const [row] = await db
      .select({ count: sql<number>`count(*)` })
      .from(patients)
      .where(and(eq(patients.clinicId, clinicId), eq(patients.isActive, true)));

    return row.count;
  },
};
