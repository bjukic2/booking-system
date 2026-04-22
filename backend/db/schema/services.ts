import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { clinics } from "./clinics";

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id")
    .references(() => clinics.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
