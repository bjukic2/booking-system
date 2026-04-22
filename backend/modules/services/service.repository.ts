import { db } from "@/backend/lib/db";
import { services } from "@/backend/db/schema/services";
import { eq } from "drizzle-orm";
import { CreateServiceInput } from "./service.types";

export const serviceRepository = {
  async create(data: CreateServiceInput) {
    const [row] = await db.insert(services).values(data).returning();
    return row;
  },

  async getAllByClinic(clinicId: number) {
    return db.select().from(services).where(eq(services.clinicId, clinicId));
  },

  async findById(id: number) {
    const [row] = await db.select().from(services).where(eq(services.id, id));
    return row;
  },
};
