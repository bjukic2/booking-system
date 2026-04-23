import { db } from "@/backend/lib/db";
import { clinics } from "@/backend/db/schema/clinics";
import { eq } from "drizzle-orm";
import { CreateClinicInput } from "./clinic.types";

export const clinicRepository = {
  async create(data: CreateClinicInput) {
    const [row] = await db.insert(clinics).values(data).returning();
    return row;
  },

  async findById(id: number) {
    const [row] = await db.select().from(clinics).where(eq(clinics.id, id));
    return row;
  },

  async findByDomain(domain: string) {
    const [row] = await db
      .select()
      .from(clinics)
      .where(eq(clinics.domain, domain));
    return row;
  },

  async getAll() {
    return db.select().from(clinics);
  },
};
