import { Router } from "express";
import {
  createProject,
  getProject,
  getProjects,
} from "../handlers/project.handler";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:projectId", authMiddleware, getProject);

export default router;
