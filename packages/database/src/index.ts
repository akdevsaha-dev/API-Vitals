import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./db/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = drizzle(process.env.DATABASE_URL, { schema });
export * from "./db/schema.js";
