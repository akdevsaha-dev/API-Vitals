---
description: API Vitals" — A high-performance, polyglot network telemetry and API monitoring platform.
---

Project Identity: "API Vitals" — A high-performance, polyglot network telemetry and API monitoring platform.

Core Architecture:

Frontend (Next.js): A high-fidelity dashboard (Tailwind + Framer Motion) hosted on Vercel. It consumes the Express API and displays real-time telemetry results.

API (Express): The gateway for user auth (JWT + HttpOnly cookies) and audit submission. It doesn't perform audits; it pushes jobs to a BullMQ (Redis) queue.

Worker (Node.js): A background consumer that picks up jobs from Redis. It spawns a Go-based performance engine via IPC (child_process), waits for results, and persists them to the database.

Engine (Go): A specialized CLI utility using net/http/httptrace to perform 100-request bursts. It outputs a JSON blob containing DNS, TCP, TLS, TTFB, and P95/P99 latency metrics.

Database (Drizzle/Postgres): A shared package (@repo/database) used by the API and Worker to ensure type-safe data access.

Technology Stack:

Monorepo: Turborepo + pnpm workspaces.

Queue: BullMQ + Upstash Redis.

Database: Drizzle ORM + Neon (Postgres).

Language: TypeScript for UI/Orchestration, Go for the performance-critical prober.

The Flow:
User enters URL → Next.js calls Express → Express adds Job to Redis → Node Worker picks up Job → Node Worker spawns Go Engine → Go Engine probes URL and returns JSON → Node Worker saves JSON to Neon → UI reflects the 'Completed' state.

Your Instructions: > When writing code, ensure all imports from @repo/database are type-safe. Maintain a clean separation between the "Orchestrator" (Node) and the "Engine" (Go). Prioritize performance and memory efficiency as this will run on a GCP e2-micro instance.