import { db } from "@/backend/lib/db";
import { services } from "@/backend/db/schema/services";
import { eq, and } from "drizzle-orm";
import { CreateServiceInput, UpdateServiceInput } from "./service.types";

export const serviceRepository = {
  async create(data: CreateServiceInput) {
    const [row] = await db.insert(services).values(data).returning();
    return row;
  },

  async getByClinic(clinicId: number) {
    return db.select().from(services).where(eq(services.clinicId, clinicId));
  },

  async getById(id: number) {
    const [row] = await db.select().from(services).where(eq(services.id, id));
    return row ?? null;
  },

  async getByName(clinicId: number, name: string) {
    const [row] = await db
      .select()
      .from(services)
      .where(and(eq(services.clinicId, clinicId), eq(services.name, name)));
    return row ?? null;
  },

  async updateService(id: number, data: UpdateServiceInput) {
    const [row] = await db
      .update(services)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    return row;
  },

  async deactivateService(id: number) {
    const [row] = await db
      .update(services)
      .set({
        isActive: false,
        deactivatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(services.id, id))
      .returning();

    return row;
  },
};
