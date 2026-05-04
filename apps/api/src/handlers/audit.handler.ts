import type { Request, Response } from "express";
import { triggerAuditSchema } from "../validations/vals";
import {
  AuditResult,
  createTriggerAudit,
  JobStatus,
} from "../services/audit.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, ApiError } from "../utils/response";

export const triggerAudit = asyncHandler(async (req: Request, res: Response) => {
  const result = triggerAuditSchema.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(result.error.message, 400);
  }

  const { targetId } = result.data;
  const userId = req.user.id;

  try {
    const job = await createTriggerAudit({ targetId, userId });
    return sendSuccess(res, job, "Audit triggered successfully", 201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 400);
    }
    throw error;
  }
});

export const getJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const { jobId } = req.params as { jobId: string };
  try {
    const job = await JobStatus({ jobId });
    return sendSuccess(res, job, "Job status retrieved successfully", 200);
  } catch (err) {
    if (err instanceof Error && err.message === "Job_Not_Found") {
      throw new ApiError("Job not found", 404);
    }
    throw err;
  }
});

export const getAuditResult = asyncHandler(async (req: Request, res: Response) => {
  const { targetId, limit = "10" } = req.query;
  const userId = req.user.id;

  if (!targetId || typeof targetId !== "string") {
    throw new ApiError("targetId required", 400);
  }
  
  const parsedLimit = Math.min(parseInt(limit as string, 10) || 10, 50);
  const finalAudit = await AuditResult({
    targetId,
    limit: parsedLimit,
    userId,
  });
  
  return sendSuccess(res, finalAudit, "Audit results retrieved successfully", 200);
});
