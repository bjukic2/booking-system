import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { clinics } from "./clinics";
import { patients } from "./patients";
import { services } from "./services";

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id")
    .references(() => clinics.id)
    .notNull(),
  patientId: integer("patient_id")
    .references(() => patients.id)
    .notNull(),
  serviceId: integer("service_id")
    .references(() => services.id)
    .notNull(),
  date: timestamp("date", { mode: "string" }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
