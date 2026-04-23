import { db } from "@repo/database";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startWorker() {
  console.log("Worker service starting...");
  db.connect();

  // Reference to Go engine for future spawning
  const enginePath = path.resolve(__dirname, "../../../services/engine");
  console.log(`Ready to spawn Go engine from: ${enginePath}`);

  // Simulation of work
  setInterval(() => {
    console.log("Worker performing heartbeat check...");
    db.query("SELECT 1");
  }, 10000);
}

startWorker().catch(console.error);
