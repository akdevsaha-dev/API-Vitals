import { Queue } from "bullmq";

const getRedisConnection = () => {
  const url = process.env.REDIS_URL;
  if (url) {
    console.log("[BullMQ] Using REDIS_URL from environment");
    return url;
  }

  if (process.env.RENDER || process.env.NODE_ENV === "production") {
    console.error("!!! ERROR: REDIS_URL missing for BullMQ in production !!!");
    return { host: "REDIS_URL_MISSING_FROM_ENV", port: 6379 };
  }

  console.log("[BullMQ] No REDIS_URL found, falling back to localhost");
  return { host: "localhost", port: 6379 };
};

export const redisConnection = getRedisConnection();

export const auditQueue = new Queue("audit", {
  connection: redisConnection as any,
});

auditQueue.on("error", (err) => {
  console.error("BullMQ Queue Error:", err.message);
});
