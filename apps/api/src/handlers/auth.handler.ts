import type { Request, Response } from "express";
import { signinSchema, signupSchema } from "../validations/vals";
import { createUser, getUser, getUserById } from "../services/auth.service";
import { jwttoken } from "../utils/jwt";
import { cookies } from "../utils/cookie";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.message,
      });
    }
    const { email, password } = result.data;
    const user = await createUser({ email, password });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
    });
    cookies.set(res, "token", token);
    return res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "User already exists") {
      return res.status(409).json({
        error: error.message,
      });
    }
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const result = signinSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.message,
      });
    }
    const { email, password } = result.data;
    const user = await getUser({ email, password });

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
    });
    cookies.set(res, "token", token);
    return res.status(200).json(user);
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "Invalid email or password"
    ) {
      return res.status(401).json({
        error: error.message,
      });
    }
    console.error(error);
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export const signout = (req: Request, res: Response) => {
  try {
    cookies.clear(res, "token");
    res.status(200).json({ message: "User signed out" });
  } catch (err: unknown) {
    let message = "Something went wrong";
    let status = 500;
    if (err instanceof Error) {
      message = err.message;
    }
    return res.status(status).json({ error: message });
  }
};

export const checkAuth = (req: Request, res: Response) => {
  try {
    const user = getUserById(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
