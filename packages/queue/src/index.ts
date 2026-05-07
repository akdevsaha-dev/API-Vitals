import { Queue } from "bullmq";

export const redisConnection =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL
    : {
        host: "localhost",
        port: 6379,
      };

export const auditQueue = new Queue("audit", {
  connection: redisConnection as any,
});
