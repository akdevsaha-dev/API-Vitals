import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getAuditResult,
  getJobStatus,
  triggerAudit,
} from "../handlers/audit.handler";

const router = Router();

router.post("/trigger", authMiddleware, triggerAudit);
router.get("/audit-jobs/:jobId", authMiddleware, getJobStatus);
router.get("/audit-results", authMiddleware, getAuditResult);
export default router;
