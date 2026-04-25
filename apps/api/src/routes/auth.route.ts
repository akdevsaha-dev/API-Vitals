import express, { Router } from "express";
import { signin, signup } from "../handlers/auth.handler";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
export default router;
