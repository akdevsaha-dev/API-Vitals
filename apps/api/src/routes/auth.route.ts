import express, { Router } from "express";
import { signup } from "../handlers/auth.handler";

const router = Router();

router.post("/signup", signup);

export default router;
