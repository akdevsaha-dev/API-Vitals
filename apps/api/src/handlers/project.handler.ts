import type { Request, Response } from "express";
import { createProjectSchema, createTargetSchema } from "../validations/vals";
import {
  createTarget,
  deletedProject,
  fetchProject,
  fetchProjects,
  Project,
} from "../services/project.service";

export const createProject = async (req: Request, res: Response) => {
  try {
    const result = createProjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.message,
      });
    }

    const { name, description } = result.data;
    const userId = req.user.id;

    const project = await Project({ name, description, userId });

    return res.status(201).json(project);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Project already exists") {
      return res.status(409).json({
        error: error.message,
      });
    }
    console.error(error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const projects = await fetchProjects(userId);
    return res.status(200).json(projects);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params as { projectId: string };
    const project = await fetchProject(projectId);
    return res.status(200).json(project);
  } catch (error: unknown) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to fetch project",
    });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params as { projectId: string };
    const userId = req.user.id;
    const project = await deletedProject({ projectId, userId });

    return res.status(200).json({
      message: "Project deleted successfully",
      project,
    });
  } catch (error: unknown) {
    console.error(error);

    if (error instanceof Error) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const Target = async (req: Request, res: Response) => {
  try {
    const result = createTargetSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.message,
      });
    }
    const { url, label } = result.data;
    const { projectId } = req.params as { projectId: string };

    const target = await createTarget({ url, label, projectId });
    return res.status(201).json(target);
  } catch (error: unknown) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
