import dotenv from "dotenv";
dotenv.config();

import express from "express";
import userModel from "./model/userModel.js";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
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

//! MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: false}));

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



app.get("/test", (req, res)=>{
    res.status(200).json({msg: "hello!!! from server"});
})

//! CONNECTION TO SERVER
app.listen(PORT, ()=>{
    console.log("Server is running on the PORT: ", PORT);
})
