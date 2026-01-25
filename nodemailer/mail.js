import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

   
export async function sendOTP(to, otp){
    await transporter.sendMail({
        from: `"CloudNest" <${process.env.EMAIL_ADDRESS}>`,
        to,
        subject: "Password Reset OTP",
        text: `Your OTP is ${otp}`,
        html: `<h1>Your OTP is ${otp}</h1>`
    });

}