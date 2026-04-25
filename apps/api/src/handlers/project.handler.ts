import type { Request, Response } from "express";
import { createProjectSchema } from "../validations/vals";
import { Project } from "../services/project.service";

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
