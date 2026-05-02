import express, { Router } from "express";
import { signin, signout, signup } from "../handlers/auth.handler";
import { authRateLimit } from "../middleware/ratelimit.middleware";

const router = Router();

router.post("/signup", authRateLimit, signup);
router.post("/signin", authRateLimit, signin);
router.post("/signout", signout);
export default router;
