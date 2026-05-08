import { createClient, type RedisClientType } from "redis";

const getRedisUrl = () => {
  const url = process.env.REDIS_URL;
  if (url) {
    console.log(`[Redis] Using REDIS_URL from environment: ${url.split('@')[1] || url}`);
    return url;
  }
  
  if (process.env.RENDER || process.env.NODE_ENV === "production") {
    console.error("!!! ERROR: REDIS_URL is NOT defined in production environment !!!");
    return "redis://REDIS_URL_IS_MISSING_IN_ENV:6379";
  }
  
  console.log("[Redis] No REDIS_URL found, falling back to localhost");
  return "redis://localhost:6379";
};

export const redis: RedisClientType = createClient({
  url: getRedisUrl(),
});

redis.on("error", (err) => {
  console.error("Redis Connection Error Details:", {
    message: err.message,
    code: (err as any).code,
    host: (err as any).address,
    port: (err as any).port,
  });
});

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};
