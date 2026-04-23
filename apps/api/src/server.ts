import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "@repo/database";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  db.query("SELECT 1");
  res.json({ status: "ok", service: "api" });
});

app.listen(port, () => {
  db.connect();
  console.log(`API server running on port ${port}`);
});
