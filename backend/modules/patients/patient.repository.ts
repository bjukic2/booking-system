import { db } from "@/backend/lib/db";
import { patients } from "@/backend/db/schema/patients";
import { eq } from "drizzle-orm";
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

  async getAll() {
    return db.select().from(patients);
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
};
