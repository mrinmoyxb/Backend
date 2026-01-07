import dotenv from "dotenv"
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import userModel from "./model/userModel.js";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT

//! CONNECTION TO DATABASE
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("connected to mongoDB");
    }).catch(()=>{
        console.log("not connected to mongoDB");
    })

//! MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

//! AUTHENTICATE
function authenticateJWT(req, res, next){
    try{
        const token = req.cookies.authJWT;
        console.log("TOKEN FETCHED FROM COOKIE: ", token);
        if(!token){
            return res.status(400).json({msg: "login to your account"});
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decodedToken.userId;
        next();
    }catch(err){
        return res.status(401).json({msg: "invalid or expired token"});
    }
}

//! SIGNUP
function isValidName(clientName){
    const regex = /^[A-Za-z ]+$/;
    return regex.test(clientName);
}
app.post("/signup", async (req, res)=>{
    try{
        let {name: userName, email: userEmail, password: userPassword} = req.body;
        userEmail = userEmail.toLowerCase();

        if(!req.body || !userName  || !userEmail || !userPassword){
            return res.status(400).json({msg: "all fields are required"});
        }

        if(!validator.isEmail(userEmail)){
            return res.status(400).json({msg: "invalid email format"});
        }
        const existingUser = await userModel.findOne({email: userEmail});
        if(existingUser){
            return res.status(400).json({msg: "email is already registered"});
        }

        if(!isValidName(userName)){
            return res.status(400).json({msg: "invalid name"});
        }

        if(userPassword.length < 8){
            return res.status(400).json({msg: "length of password should be greater than or equal to 8"});
        }
        const hashedPassword = await bcrypt.hash(userPassword, Number(process.env.SALT_ROUNDS));

        const newUser = await userModel.create({
            name: userName,
            email: userEmail,
            password: hashedPassword
        })

        return res.status(201).json({msg: "user created successfully"});
    }catch(err){
        return res.status(500).json({msg: "internal server error"});
    }
})

//! LOGIN
app.post("/login", async (req, res)=>{
    let {email: userEmail, password: userPassword} = req.body;

    if(!req.body || !userEmail || !userPassword){
        return res.status(400).json({msg: "all fields are required"});
    }

    if(!validator.isEmail(userEmail)){
        return res.status(400).json({msg: "invalid email"});
    }
    const existingUser = await userModel.findOne({email: userEmail});
    if(!existingUser){
        return res.status(400).json({msg: "please login with a registered mail"});
    }

    const isPassword = await bcrypt.compare(userPassword, existingUser.password);
    if(!isPassword){
        return res.status(400).json({msg: "incorrect password"});
    }

    const JWTToken = jwt.sign({
        userId: existingUser._id,
        userEmail: existingUser.email
    }, process.env.SECRET_KEY,
    {expiresIn: "1m"});

    res.cookie("authJWT", JWTToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 1000
    });

    return res.status(200).redirect("/test");
})

//! LOGOUT
app.post("/logout", (req, res)=>{
    res.clearCookie("authJWT", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    return res.status(200).json({msg: "Logged out successfully"});
})

//! TEST 
app.get("/test", authenticateJWT, async(req, res)=>{
    let userId = req.userId;
    const user = await userModel.findById(userId);
    res.status(200).json({msg: "hello!!! from server"});
})

//! CONNECTION TO SERVER
app.listen(PORT, ()=>{
    console.log("Server is running on the PORT: ", PORT);
})
