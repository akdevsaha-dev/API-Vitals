import type { Request, Response } from "express";
import { triggerAuditSchema } from "../validations/vals";
import {
  AuditResult,
  createTriggerAudit,
  JobStatus,
} from "../services/audit.service";

export const triggerAudit = async (req: Request, res: Response) => {
  try {
    const result = triggerAuditSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.message,
      });
    }

    const { targetId } = result.data;

    const userId = req.user.id;

    const job = await createTriggerAudit({ targetId, userId });

    return res.status(201).json(job);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getJobStatus = async (req: Request, res: Response) => {
  const { jobId } = req.params as { jobId: string };
  try {
    const job = await JobStatus({ jobId });
    return res.status(200).json(job);
  } catch (err) {
    if (err instanceof Error && err.message === "Job_Not_Found") {
      return res.status(404).json({
        error: "Job not found",
      });
    }
    console.error("Database Error:", err);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const getAuditResult = async (req: Request, res: Response) => {
  try {
    const { targetId, limit = "10" } = req.query;
    const userId = req.user.id;

    if (!targetId || typeof targetId !== "string") {
      return res.status(400).json({ error: "targetId required" });
    }
    const parsedLimit = Math.min(parseInt(limit as string, 10) || 10, 50);
    const finalAudit = await AuditResult({
      targetId,
      limit: parsedLimit,
      userId,
    });
    return res.json(finalAudit);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
