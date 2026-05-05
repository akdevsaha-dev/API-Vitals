import "dotenv/config";
import { db } from "./index";
import { userTable, projects, targets } from "./db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting seed process...");

  try {
    const users = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, "honeybunny@gmail.com"));

    if (users.length === 0) {
      console.error("User honeybunny@gmail.com not found. Please register this user first.");
      process.exit(1);
    }

    const userId = users[0].id;
    console.log(`Found user: ${userId}`);

    // Reset projects for this user to avoid duplicates
    console.log("Cleaning up existing projects...");
    await db.delete(projects).where(eq(projects.userId, userId));
    const newProjects = [
      {
        name: "Acme Corp Production",
        description: "Main production environment for Acme Corp APIs.",
        userId,
      },
      {
        name: "Staging Cluster",
        description: "Pre-production testing environment.",
        userId,
      },
    ];

    console.log("Inserting projects...");
    const insertedProjects = await db.insert(projects).values(newProjects).returning();
    console.log("Projects inserted successfully!");

    const mainProjectId = insertedProjects[0].id;
    console.log(`Inserting target for project: ${mainProjectId}`);

    await db.insert(targets).values([
      {
        url: "https://api.github.com/zen",
        label: "GitHub Zen API",
        projectId: mainProjectId,
      }
    ]);
    console.log("Target inserted successfully!");

  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    process.exit(0);
  }
}

seed();
