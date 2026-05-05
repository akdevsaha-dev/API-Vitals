import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { deleteTarget } from "../handlers/target.handler";

const router = Router();

router.delete("/:targetId", authMiddleware, deleteTarget);
export default router;
