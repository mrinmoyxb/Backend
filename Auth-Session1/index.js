import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userModel from "./model/userModel.js";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

//! CONNECTION TO DATABASE
mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("connected to mongoDB");
    }).catch(()=>{
        console.log("not connected to mongoDB");
    })

//! SESSION STORAGE OF SERVER
let sessions = {}

function generateSessionId(){
    return crypto.randomBytes(64).toString("hex");
}

//! MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: false}));

function authenticateSession(req, res, next){
    const cookies = req.headers.cookie;
    if(!cookies){
        return res.json({msg: "login in to your account"});
    }

    const cookie = Object.fromEntries(
        cookies.split("; ").map(c=>c.split("="))
    );

    if(sessions[cookieData.authSessionId]){
        console.log("Session Id from cookie: ", sessions[cookie.sessionId]);
    }else{
        console.log("This session id is invalid");
    }

    const sessionId = cookie.sessionId;
    if(sessionId && sessions[sessionId]){
        req.sessionId = sessions[sessionId];
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

app.post("/login", async (req, res)=>{
    let {email: userEmail, password: userPassword} = req.body;

    if(!req.body || !userEmail || !userPassword){
        return res.status(400).json({msg: "all fields are required"});
    }

    if(!validator.isEmail(userEmail)){
        return res.status(400).json({msg: "invalid email"});
    }
    const existingUser = await userModel.findOne({emai: userEmail});
    if(!existingUser){
        return res.status(400).json({msg: "please login with a registered mail"});
    }

    const isPassword = await bcrypt.compare(userPassword, existingUser.password);
    if(!isPassword){
        return res.status(400).json({msg: "incorrect password"});
    }

    const sessionId = generateSessionId();
        sessions[sessionId] = {
            userId: existingUser._id,
            email: existingUser.email,
            createdAt: Date.now()
        }
    
    res.cookie("authSessionId", sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 120 * 1000
    })

    return res.status(200).redirect("/test");
})

app.get("/test", (req, res)=>{
    res.status(200).json({msg: "hello!!! from server"});
})

//! CONNECTION TO SERVER
app.listen(PORT, ()=>{
    console.log("Server is running on the PORT: ", PORT);
})
