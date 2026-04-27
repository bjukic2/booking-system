import { db } from "@/backend/lib/db";
import { clinics } from "@/backend/db/schema/clinics";
import { eq } from "drizzle-orm";
import { CreateClinicInput, UpdateClinicInput } from "./clinic.types";

export const clinicRepository = {
  async create(data: CreateClinicInput) {
    const [row] = await db.insert(clinics).values(data).returning();
    return row;
  },

  async getById(id: number) {
    const [row] = await db.select().from(clinics).where(eq(clinics.id, id));
    return row;
  },

  async getByDomain(domain: string) {
    const [row] = await db
      .select()
      .from(clinics)
      .where(eq(clinics.domain, domain));
    return row;
  },

  async updateClinic(id: number, data: UpdateClinicInput) {
    return db
      .update(clinics)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(clinics.id, id))
      .returning();
  },

  async deactivateClinic(id: number) {
    return db
      .update(clinics)
      .set({
        isActive: false,
        deactivatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(clinics.id, id))
      .returning();
  },

  async getAll() {
    return db.select().from(clinics);
  },
};
