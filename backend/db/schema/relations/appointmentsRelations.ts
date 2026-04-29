import { relations } from "drizzle-orm";
import { appointments } from "../appointments";
import { patients } from "../patients";
import { services } from "../services";

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));
