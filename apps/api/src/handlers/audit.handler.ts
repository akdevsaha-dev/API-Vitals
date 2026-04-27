import type { Request, Response } from "express";
import { triggerAuditSchema } from "../validations/vals";
import { createTriggerAudit } from "../services/audit.service";

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
