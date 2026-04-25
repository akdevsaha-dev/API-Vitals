import { Request, Response } from "express";
import { signinSchema, signupSchema } from "../validations/vals";
import { createUser, getUser } from "../services/auth.service";

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

    return res.status(201).json(user);
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(409).json({
        error: error.message,
      });
    }
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
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
    return res.status(200).json(user);
  } catch (error: any) {
    if (error.message === "Invalid email or password") {
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
