import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.get("/", (req, res)=>{
    res.render("home");
})


app.listen(PORT, ()=>{
    console.log("SERVER IS RUNNING ON PORT: ", PORT);
})