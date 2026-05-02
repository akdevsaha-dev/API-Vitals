import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { config } from "./configs/config";
import authRouter from "./routes/auth.route";
import projectRouter from "./routes/project.route";
import targetRouter from "./routes/target.route";
import auditRouter from "./routes/audit.route";
import { connectRedis } from "@repo/lib";

const PORT = config.port;
async function start() {
  try {
    await connectRedis();
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.get("/health", (req, res) => {
      res.send("Ok!");
    });
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/projects", projectRouter);
    app.use("/api/v1/targets", targetRouter);
    app.use("/api/v1/audits", auditRouter);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`App is running on port: ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
