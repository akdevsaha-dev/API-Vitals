import { createClient, type RedisClientType } from "redis";

export const redis: RedisClientType = createClient({
  url: "redis://redis:6379",
});

redis.on("error", (err) => console.error("redis error", err));

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
  }
};
