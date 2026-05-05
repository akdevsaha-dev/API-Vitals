import { db, projects, targets } from "@repo/database";
import { createProjectInput, createTargetInput } from "../validations/vals";
import { and, eq } from "drizzle-orm";

type CreateProjectArgs = createProjectInput & {
  userId: string;
};

type DeleteProjectArgs = {
  projectId: string;
  userId: string;
};

type Targetargs = createTargetInput & {
  projectId: string;
};

export const Project = async ({
  name,
  description,
  userId,
}: CreateProjectArgs) => {
  const existingProject = await db.query.projects.findFirst({
    where: and(eq(projects.name, name), eq(projects.userId, userId)),
  });
  if (existingProject) {
    throw new Error("Project already exists");
  }
  try {
    const [project] = await db
      .insert(projects)
      .values({
        name,
        description: description ?? null,
        userId,
      })
      .returning({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        createdAt: projects.createdAt,
      });

    return project;
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "23505"
    ) {
      throw new Error("Project already exists");
    }

    throw new Error("Failed to create project");
  }
};

export const fetchProjects = async (userId: string) => {
  try {
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, userId),
      with: {
        targets: true,
      },
    });

    return userProjects;
  } catch (err: unknown) {
    throw new Error("Failed to fetch projects");
  }
};

export const fetchProject = async (projectId: string, userId: string) => {
  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, projectId), eq(projects.userId, userId)),
    with: {
      targets: {
        with: {
          results: {
            limit: 20,
            orderBy: (auditResults, { desc }) => [desc(auditResults.createdAt)],
          },
        },
      },
    },
  });
  return project;
};

export const deletedProject = async ({
  projectId,
  userId,
}: DeleteProjectArgs) => {
  const result = await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning({ id: projects.id });

  if (result.length === 0) {
    throw new Error("Project not found or unauthorized");
  }
  return result[0];
};

export const createTarget = async ({ url, label, projectId }: Targetargs) => {
  const [createdTarget] = await db
    .insert(targets)
    .values({
      url,
      label,
      projectId,
    })
    .returning({
      id: targets.id,
      url: targets.url,
      label: targets.label,
      projectId: targets.projectId,
      createdAt: targets.createdAt,
    });
  if (!createdTarget) {
    throw new Error("TARGET_CREATION_FAILED");
  }
  return createdTarget;
};
