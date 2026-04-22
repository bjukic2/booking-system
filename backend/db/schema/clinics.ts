import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const clinics = pgTable("clinics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
