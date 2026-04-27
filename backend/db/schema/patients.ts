import {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { clinics } from "./clinics";

export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id")
    .references(() => clinics.id)
    .notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deactivatedAt: timestamp("deactivated_at"),
});
