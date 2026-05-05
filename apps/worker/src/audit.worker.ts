import { auditJobs, auditResults, db } from "@repo/database";
import { Worker } from "bullmq";
import { eq } from "drizzle-orm";
import { runAudit } from "./runAudit";

new Worker("audit", async (job) => {
  const { jobId, url, targetId } = job.data;

  try {
    await db
      .update(auditJobs)
      .set({
        status: "processing",
        startedAt: new Date(),
      })
      .where(eq(auditJobs.id, jobId));

    const result = await runAudit(url);

    await db.insert(auditResults).values({
      jobId,
      targetId,
      dnsTime: result.dns_time,
      tcpTime: result.tcp_time,
      tlsTime: result.tls_time,
      ttfb: result.ttfb,
      totalTime: result.total_time,
      p50: result.p50,
      p95: result.p95,
      p99: result.p99,
      stdDev: result.std_dev,
      statusCode: Math.floor(result.status_code),
    });
    await db
      .update(auditJobs)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(auditJobs.id, jobId));
  } catch (err) {
    await db
      .update(auditJobs)
      .set({
        status: "failed",
        errorLog: String(err),
      })
      .where(eq(auditJobs.id, jobId));
  }
}, {
  connection: {
    host: "localhost",
    port: 6379,
  }
});
