import type { Request, Response } from "express";
import { DeletedTarget } from "../services/target.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";

export const deleteTarget = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params as { targetId: string };
  const userId = req.user.id;
  const deleted = await DeletedTarget(targetId, userId);
  return sendSuccess(res, { deletedTarget: deleted }, "Target deleted successfully", 200);
});
