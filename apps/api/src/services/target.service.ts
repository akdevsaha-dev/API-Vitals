import { db, targets } from "@repo/database";
import { eq } from "drizzle-orm";

export const DeletedTarget = async (targetId: string, userId: string) => {
  const target = await db.query.targets.findFirst({
    where: eq(targets.id, targetId),
    with: {
      project: true,
    },
  });

  if (!target || target.project.userId !== userId) {
    throw new Error("TARGET_NOT_FOUND_OR_UNAUTHORIZED");
  }

  const [deleted] = await db
    .delete(targets)
    .where(eq(targets.id, targetId))
    .returning({
      id: targets.id,
    });
  return deleted;
};
