import type { Request, Response } from "express";
import { signinSchema, signupSchema } from "../validations/vals";
import { createUser, getUser, getUserById } from "../services/auth.service";
import { jwttoken } from "../utils/jwt";
import { cookies } from "../utils/cookie";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, ApiError } from "../utils/response";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(result.error.message, 400);
  }
  
  const { email, password } = result.data;
  
  try {
    const user = await createUser({ email, password });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
    });
    cookies.set(res, "token", token);
    return sendSuccess(res, user, "User signed up successfully", 201);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User already exists") {
      throw new ApiError(error.message, 409);
    }
    throw error;
  }
});

export const signin = asyncHandler(async (req: Request, res: Response) => {
  const result = signinSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(result.error.message, 400);
  }
  const { email, password } = result.data;
  
  try {
    const user = await getUser({ email, password });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
    });
    cookies.set(res, "token", token);
    return sendSuccess(res, user, "User signed in successfully", 200);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Invalid email or password") {
      throw new ApiError(error.message, 401);
    }
    throw error;
  }
});

export const signout = asyncHandler(async (req: Request, res: Response) => {
  cookies.clear(res, "token");
  return sendSuccess(res, null, "User signed out", 200);
});

export const checkAuth = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.user.id);
  return sendSuccess(res, user, "Authenticated", 200);
});
