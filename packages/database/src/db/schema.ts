import { relations } from "drizzle-orm";
import {
  doublePrecision,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const userTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    userId: uuid("user_id")
      .references(() => userTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("project_user_idx").on(table.userId)],
);

export const targets = pgTable(
  "targets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),

    url: text("url").notNull(),
    label: text("label"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("target_project_idx").on(table.projectId)],
);

export const auditJobs = pgTable(
  "audit_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    targetId: uuid("target_id")
      .references(() => targets.id, { onDelete: "cascade" })
      .notNull(),

    status: jobStatusEnum("status").default("pending").notNull(),

    workerNode: text("worker_node"),

    errorLog: text("error_log"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("job_status_idx").on(table.status),
    index("job_target_idx").on(table.targetId),
  ],
);

export const auditResults = pgTable(
  "audit_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    jobId: uuid("job_id")
      .references(() => auditJobs.id, { onDelete: "cascade" })
      .notNull(),

    targetId: uuid("target_id")
      .references(() => targets.id, { onDelete: "cascade" })
      .notNull(),

    dnsTime: doublePrecision("dns_time").notNull(),
    tcpTime: doublePrecision("tcp_time").notNull(),
    tlsTime: doublePrecision("tls_time").notNull(),
    ttfb: doublePrecision("ttfb").notNull(),
    totalTime: doublePrecision("total_time").notNull(),

    p50: doublePrecision("p50").notNull(),
    p95: doublePrecision("p95").notNull(),
    p99: doublePrecision("p99").notNull(),
    stdDev: doublePrecision("std_dev").notNull(),

    statusCode: integer("status_code").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("results_target_time_idx").on(table.targetId, table.createdAt),
    uniqueIndex("results_job_idx").on(table.jobId),
  ],
);

export const userRelations = relations(userTable, ({ many }) => ({
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(userTable, {
    fields: [projects.userId],
    references: [userTable.id],
  }),
  targets: many(targets),
}));

export const targetsRelations = relations(targets, ({ one, many }) => ({
  project: one(projects, {
    fields: [targets.projectId],
    references: [projects.id],
  }),
  jobs: many(auditJobs),
  results: many(auditResults),
}));

export const auditJobsRelations = relations(auditJobs, ({ one }) => ({
  target: one(targets, {
    fields: [auditJobs.targetId],
    references: [targets.id],
  }),
  result: one(auditResults),
}));

export const auditResultsRelations = relations(auditResults, ({ one }) => ({
  job: one(auditJobs, {
    fields: [auditResults.jobId],
    references: [auditJobs.id],
  }),
  target: one(targets, {
    fields: [auditResults.targetId],
    references: [targets.id],
  }),
}));
