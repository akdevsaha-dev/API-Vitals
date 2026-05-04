import { Request, Response, NextFunction } from "express";
import { ApiError, sendError } from "./response";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler =
  (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error(err);
      if (err instanceof ApiError) {
        return sendError(res, err.message, err.statusCode, err.error);
      }
      return sendError(
        res,
        err.message || "Internal Server Error",
        500,
        err
      );
    });
  };
