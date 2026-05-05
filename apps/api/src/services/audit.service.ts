import {
  auditJobs,
  auditResults,
  db,
  projects,
  targets,
} from "@repo/database";
import { triggerInput } from "../validations/vals";
import { and, desc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { auditQueue } from "@repo/queue";

type createTriggerAuditProps = triggerInput & {
  userId: string;
};

export const createTriggerAudit = async ({
  targetId,
  userId,
}: createTriggerAuditProps) => {
  const target = await db
    .select({
      id: targets.id,
      url: targets.url,
    })
    .from(targets)
    .innerJoin(projects, eq(targets.projectId, projects.id))
    .where(and(eq(targets.id, targetId), eq(projects.userId, userId)))
    .limit(1);

  if (target.length === 0) {
    throw new Error("TARGET_NOT_FOUND_OR_UNAUTHORIZED");
  }
  const jobId = randomUUID();

  await db.insert(auditJobs).values({
    id: jobId,
    targetId,
    status: "pending",
  });

  try {
    await auditQueue.add("run_audit", {
      jobId,
      url: target[0].url,
      targetId,
    });
    return { jobId };
  } catch (err) {
    await db
      .update(auditJobs)
      .set({
        status: "failed",
        errorLog: "QUEUE_PUSH_FAILED",
      })
      .where(eq(auditJobs.id, jobId));

    throw new Error("QUEUE_PUSH_FAILED");
  }
};

export const JobStatus = async ({ jobId }: { jobId: string }) => {
  const [job] = await db
    .select()
    .from(auditJobs)
    .where(eq(auditJobs.id, jobId))
    .limit(1);

  if (!job) {
    throw new Error("Job_Not_Found");
  }
  return job;
};

export const AuditResult = async ({
  targetId,
  limit,
  userId,
}: {
  targetId: string;
  limit: number;
  userId: string;
}) => {
  const result = await db
    .select()
    .from(auditResults)
    .innerJoin(targets, eq(auditResults.targetId, targets.id))
    .innerJoin(projects, eq(targets.projectId, projects.id))
    .where(
      and(eq(auditResults.targetId, targetId), eq(projects.userId, userId)),
    )
    .orderBy(desc(auditResults.createdAt))
    .limit(limit);
  return result;
};

export const AuditHistory = async ({
  userId,
  limit,
  offset,
  projectId,
}: {
  userId: string;
  limit: number;
  offset: number;
  projectId?: string;
}) => {
  const result = await db
    .select({
      job: auditJobs,
      target: targets,
      project: projects,
      result: auditResults,
    })
    .from(auditJobs)
    .innerJoin(targets, eq(auditJobs.targetId, targets.id))
    .innerJoin(projects, eq(targets.projectId, projects.id))
    .leftJoin(auditResults, eq(auditJobs.id, auditResults.jobId))
    .where(
      and(
        eq(projects.userId, userId),
        projectId ? eq(projects.id, projectId) : undefined
      )
    )
    .orderBy(desc(auditJobs.createdAt))
    .limit(limit)
    .offset(offset);
  
  return result;
};

export const getAuditHistoryById = async ({
  userId,
  jobId,
}: {
  userId: string;
  jobId: string;
}) => {
  const result = await db
    .select({
      job: auditJobs,
      target: targets,
      project: projects,
      result: auditResults,
    })
    .from(auditJobs)
    .innerJoin(targets, eq(auditJobs.targetId, targets.id))
    .innerJoin(projects, eq(targets.projectId, projects.id))
    .leftJoin(auditResults, eq(auditJobs.id, auditResults.jobId))
    .where(and(eq(projects.userId, userId), eq(auditJobs.id, jobId)))
    .limit(1);

  if (result.length === 0) {
    throw new Error("Job_Not_Found");
  }

  return result[0];
};
