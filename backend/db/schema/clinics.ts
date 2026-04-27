import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deactivatedAt: timestamp("deactivated_at"),
});
