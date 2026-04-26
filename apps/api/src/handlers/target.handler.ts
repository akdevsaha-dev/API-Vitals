import type { Request, Response } from "express";
import { DeletedTarget } from "../services/target.service";

export const deleteTarget = async (req: Request, res: Response) => {
  try {
    const { targetId } = req.params as { targetId: string };
    const userId = req.user.id;
    const deleted = await DeletedTarget(targetId, userId);
    return res.status(200).json({ deletedTarget: deleted });
  } catch (error: unknown) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
