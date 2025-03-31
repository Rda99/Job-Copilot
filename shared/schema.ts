import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  avatar: text("avatar"),
  plan: text("plan").default("free"),
});

// LLM Settings
export const llmSettings = pgTable("llm_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  apiKey: text("api_key"),
  ollamaEndpoint: text("ollama_endpoint"),
});

// Resume entries
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Job entries
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  salary: text("salary"),
  description: text("description"),
  matchScore: integer("match_score"),
  status: text("status").notNull().default("saved"),
  appliedDate: timestamp("applied_date"),
  favorite: boolean("favorite").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cover letter entries
export const coverLetters = pgTable("cover_letters", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  jobId: integer("job_id").references(() => jobs.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Interview preparations
export const interviewPreps = pgTable("interview_preps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  jobId: integer("job_id").references(() => jobs.id),
  questions: jsonb("questions").notNull(),
  answers: jsonb("answers"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schema for user insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
});

// Schema for LLM settings insertion
export const insertLLMSettingsSchema = createInsertSchema(llmSettings).pick({
  userId: true,
  provider: true,
  model: true,
  apiKey: true,
  ollamaEndpoint: true,
});

// Schema for job insertion
export const insertJobSchema = createInsertSchema(jobs).pick({
  userId: true,
  title: true,
  company: true,
  location: true,
  salary: true,
  description: true,
  matchScore: true,
  status: true,
  favorite: true,
});

// Schema for resume insertion
export const insertResumeSchema = createInsertSchema(resumes).pick({
  userId: true,
  title: true,
  content: true,
});

// Schema for cover letter insertion
export const insertCoverLetterSchema = createInsertSchema(coverLetters).pick({
  userId: true,
  jobId: true,
  title: true,
  content: true,
});

// Schema for interview prep insertion
export const insertInterviewPrepSchema = createInsertSchema(interviewPreps).pick({
  userId: true,
  jobId: true,
  questions: true,
  answers: true,
  notes: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type LLMSettings = typeof llmSettings.$inferSelect;
export type InsertLLMSettings = z.infer<typeof insertLLMSettingsSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;

export type CoverLetter = typeof coverLetters.$inferSelect;
export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;

export type InterviewPrep = typeof interviewPreps.$inferSelect;
export type InsertInterviewPrep = z.infer<typeof insertInterviewPrepSchema>;
