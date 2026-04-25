import express, { Router } from "express";
import { signin, signout, signup } from "../handlers/auth.handler";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
export default router;
