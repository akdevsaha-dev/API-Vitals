import { Router } from "express";
import { createProject, getProjects } from "../handlers/project.handler";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);

export default router;
