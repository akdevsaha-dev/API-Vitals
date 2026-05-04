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
      dnsTime: result.DNSTime,
      tcpTime: result.TCPTime,
      tlsTime: result.TLSTime,
      ttfb: result.TTFB,
      totalTime: result.TotalTime,
      p50: result.P50,
      p95: result.P95,
      p99: result.P99,
      stdDev: result.StdDev,
      statusCode: result.StatusCode,
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
});
