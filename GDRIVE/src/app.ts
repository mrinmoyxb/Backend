import "dotenv/config"
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes.ts";
import fileRouter from "./modules/file/file.route.ts";
import { utilConnectMongoDB } from "./utils/connectDB.util.ts";
import { middlewareAuthenticateAccessToken } from "./modules/auth/auth.middleware.ts";

const app = express();
await utilConnectMongoDB();


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());


app.use("/api/v1/auth", authRouter);

app.get("/api/v1/test", middlewareAuthenticateAccessToken, (req, res)=>{
    return res.json({msg: "welcome to orbit drive"});
})

app.use("/api/v1/file", fileRouter);

export default app;