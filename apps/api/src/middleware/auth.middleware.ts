import type { NextFunction, Request, Response } from "express";
import { jwttoken } from "../utils/jwt";

interface Jwt_Payload {
  id: string;
  email: string;
}
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwttoken.verify(token) as Jwt_Payload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
