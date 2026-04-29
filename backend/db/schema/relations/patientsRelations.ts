import { relations } from "drizzle-orm";
import { patients } from "../patients";
import { appointments } from "../appointments";

export const patientsRelations = relations(patients, ({ many }) => ({
  appointments: many(appointments),
}));
