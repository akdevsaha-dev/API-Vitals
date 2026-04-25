import { Router } from "express";
import { createProject } from "../handlers/project.handler";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createProject);

export default router;
