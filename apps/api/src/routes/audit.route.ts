import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getAuditResult,
  getJobStatus,
  triggerAudit,
  getAuditHistory,
  getAuditHistoryById,
} from "../handlers/audit.handler";

const router = Router();

router.post("/trigger", authMiddleware, triggerAudit);
router.get("/audit-jobs/:jobId", authMiddleware, getJobStatus);
router.get("/audit-results", authMiddleware, getAuditResult);
router.get("/history", authMiddleware, getAuditHistory);
router.get("/history/:id", authMiddleware, getAuditHistoryById);
export default router;
