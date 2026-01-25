import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { sendOTP } from "./mail.js";
const app = express();

console.log("EMAIL: ", process.env.EMAIL_ADDRESS);
console.log("PASSWORD: ", process.env.EMAIL_PASSWORD);

app.get("/home", async (req, res)=>{
    console.log("Home");
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendOTP("mrinmoyborahdev@gmail.com", otp);
    return res.json({msg: "OTP SENT"});
})

app.listen(8005, ()=>{
    console.log("Server is running on PORT: ", 8005);
})

