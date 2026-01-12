import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import mongoose, { mongo } from "mongoose";
import cookieParser from "cookie-parser";
import checkForAuthenticationCookie from "./middlewares/authentication.js";

import userRoutes from "./routes/userRoute.js";
import blogRoutes from "./routes/blogRoute.js";

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
app.use(express.static(path.resolve("./public")));

import blog from "./models/blogModel.js"

app.get("/", async (req, res)=>{
    const allBlogs = await blog.find({}).sort('createdAt', -1);
    res.render("home.ejs", {
        user:req.user,
        blogs: allBlogs
    });
})

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

app.listen(PORT, ()=>{
    console.log("SERVER IS RUNNING ON PORT: ", PORT);
})