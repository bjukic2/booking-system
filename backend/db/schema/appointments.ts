import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  boolean,
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
  startTime: timestamp("start_time", { mode: "string" }).notNull(),
  endTime: timestamp("end_time", { mode: "string" }).notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  note: varchar("note", { length: 500 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  cancelledAt: timestamp("cancelled_at"),
});
