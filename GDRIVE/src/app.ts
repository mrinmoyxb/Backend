import "dotenv/config"
import express from "express";
import authRouter from "./modules/auth/auth.routes.ts";

const app = express();

app.set("view engine", "ejs");

app.use("/api/v1/auth", authRouter);

export default app;