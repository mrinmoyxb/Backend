import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import userRoutes from "./routes/userRoute.js";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middlewares/authentication.js";

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("connected to mongoDB");
    }).catch(()=>{
        console.log("not connected to mongoDB");
    })

const app = express();
const PORT = process.env.PORT

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", (req, res)=>{
    res.render("home.ejs", {
        user:req.user
    });
})




app.use("/user", userRoutes);

app.listen(PORT, ()=>{
    console.log("SERVER IS RUNNING ON PORT: ", PORT);
})