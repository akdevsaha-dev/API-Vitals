import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { triggerAudit } from "../handlers/audit.handler";

const router = Router();

router.post("/trigger", authMiddleware, triggerAudit);

export default router;
