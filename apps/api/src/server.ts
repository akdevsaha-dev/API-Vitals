import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { config } from "./configs/config";
import authRouter from "./routes/auth.route";
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = config.port;
app.get("/health", (req, res) => {
  res.send("Ok!");
});
app.use("/api/v1/auth", authRouter);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is running on port: ${PORT}`);
});
