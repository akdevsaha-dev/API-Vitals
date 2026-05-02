import { spawn } from "child_process";
import { AuditEngineResult } from "./types";

export function runAudit(url: string): Promise<AuditEngineResult> {
  return new Promise((resolve, reject) => {
    const ls = spawn("./engine", [url]);
    let data = "";
    let error = "";

    ls.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });
    ls.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });
    ls.on("close", (code) => {
      if (code !== 0) return reject(error);
      try {
        resolve(JSON.parse(data));
      } catch {
        reject("Invalid JSON from Go");
      }
    });
  });
}
