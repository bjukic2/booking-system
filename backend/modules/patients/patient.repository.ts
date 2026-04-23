import { db } from "@/backend/lib/db";
import { patients } from "@/backend/db/schema/patients";
import { eq } from "drizzle-orm";
import { CreatePatientInput } from "./patient.types";

export const patientRepository = {
  async create(data: CreatePatientInput) {
    const [row] = await db.insert(patients).values(data).returning();
    return row;
  },

  async findById(id: number) {
    const [row] = await db.select().from(patients).where(eq(patients.id, id));
    return row;
  },

  async findByEmail(email: string) {
    const [row] = await db
      .select()
      .from(patients)
      .where(eq(patients.email, email));
    return row;
  },

  async findByPhone(phone: string) {
    const [row] = await db
      .select()
      .from(patients)
      .where(eq(patients.phone, phone));
    return row;
  },

  async getAll() {
    return db.select().from(patients);
  },
};
