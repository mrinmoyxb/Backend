import "dotenv/config"
import express from "express";
import authRouter from "./modules/auth/auth.routes.ts";
import { utilConnectMongoDB } from "./utils/connectDBUtil.ts";

const app = express();
utilConnectMongoDB();

app.set("view engine", "ejs");

app.use("/api/v1/auth", authRouter);

export default app;