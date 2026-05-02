import { redis } from "@repo/lib";
import type { Request, Response, NextFunction } from "express";

const CAPACITY = 10;
const REFILL_RATE = 1;
const EXPIRE_SECONDS = 60;

export const authRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const identifier = req.user?.id ?? req.ip;
    const key = `bucker:${identifier}`;
    const now = Date.now();
    const data = await redis.hGetAll(key);

    let tokens = data.tokens ? parseFloat(data.tokens) : CAPACITY;
    let lastRefill = data.lastRefil ? parseFloat(data.lastRefil) : now;

    const ellapsedSeconds = (now - lastRefill) / 1000;
    const refill = ellapsedSeconds * REFILL_RATE;

    tokens = Math.min(CAPACITY, tokens + refill);

    if (tokens < 1) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Try again later.",
      });
    }
    tokens -= 1;

    await redis.hSet(key, {
      tokens: tokens.toString(),
      lastRefill: now.toString(),
    });

    await redis.expire(key, EXPIRE_SECONDS);

    next();
  } catch (error) {
    console.error("Token bucket error:", error);
    next();
  }
};
