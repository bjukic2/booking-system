import { relations } from "drizzle-orm";
import { services } from "../services";
import { appointments } from "../appointments";

export const servicesRelations = relations(services, ({ many }) => ({
  appointments: many(appointments),
}));
