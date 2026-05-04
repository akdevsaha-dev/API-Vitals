import type { Request, Response } from "express";
import { createProjectSchema, createTargetSchema } from "../validations/vals";
import {
  createTarget,
  deletedProject,
  fetchProject,
  fetchProjects,
  Project,
} from "../services/project.service";
import { and, eq } from "drizzle-orm";
import { db, projects } from "@repo/database/index";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, ApiError } from "../utils/response";

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const result = createProjectSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(result.error.message, 400);
  }

  const { name, description } = result.data;
  const userId = req.user.id;

  try {
    const project = await Project({ name, description, userId });
    return sendSuccess(res, project, "Project created successfully", 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Project already exists") {
      throw new ApiError(error.message, 409);
    }
    throw error;
  }
});

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const projects = await fetchProjects(userId);
  return sendSuccess(res, projects, "Projects retrieved successfully", 200);
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const userId = req.user.id;
  try {
    const project = await fetchProject(projectId, userId);
    return sendSuccess(res, project, "Project retrieved successfully", 200);
  } catch (error: unknown) {
    throw new ApiError("Failed to fetch project", 500);
  }
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params as { projectId: string };
  const userId = req.user.id;
  try {
    const project = await deletedProject({ projectId, userId });
    return sendSuccess(res, project, "Project deleted successfully", 200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 404);
    }
    throw error;
  }
});

export const Target = asyncHandler(async (req: Request, res: Response) => {
  const result = createTargetSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(result.error.message, 400);
  }
  const { url, label } = result.data;
  const { projectId } = req.params as { projectId: string };
  const userId = req.user.id;

  const project = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.userId, userId),
    ),
  });

  if (!project) {
    throw new ApiError("Unauthorized access to project", 403);
  }
  const target = await createTarget({ url, label, projectId });
  return sendSuccess(res, target, "Target created successfully", 201);
});
