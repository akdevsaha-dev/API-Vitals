import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  Target,
} from "../handlers/project.handler";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:projectId", authMiddleware, getProject);
router.delete("/:projectId", authMiddleware, deleteProject);
router.post("/:projectId/targets", authMiddleware, Target);

export default router;
