import { auditJobs, db, projects, targets } from "@repo/database/index";
import { triggerInput } from "../validations/vals";
import { and, eq } from "drizzle-orm";
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
