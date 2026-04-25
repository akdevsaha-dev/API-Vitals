import { db, projects } from "@repo/database/index";
import { createProjectInput } from "../validations/vals";
import { and, eq } from "drizzle-orm";

type CreateProjectArgs = createProjectInput & {
  userId: string;
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
