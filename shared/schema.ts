import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const videoGenerations = pgTable("video_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  characterImageUrl: text("character_image_url").notNull(),
  script: text("script").notNull(),
  videoUrl: text("video_url"),
  duration: integer("duration").notNull().default(5),
  quality: text("quality").notNull().default("768"),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVideoGenerationSchema = createInsertSchema(videoGenerations).pick({
  characterImageUrl: true,
  script: true,
  duration: true,
  quality: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVideoGeneration = z.infer<typeof insertVideoGenerationSchema>;
export type VideoGeneration = typeof videoGenerations.$inferSelect;
