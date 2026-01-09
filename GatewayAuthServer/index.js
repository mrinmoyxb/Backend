import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import userModel from "./model/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log("connected to mongoDB");
    })
    .catch(()=>{
        console.log("couldn't connect to mongodb");
    })

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
        email: existingUser.email
    }, process.env.SECRET_KEY,{
        expiresIn: "1m"
    });

    res.cookie("authJWT", JWTToken, 
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 1000
        }
    )

    return res.status(200).redirect("/test");
})

app.listen(PORT, ()=>{
    console.log("Auth Server is running on the PORT: ", PORT);
})
