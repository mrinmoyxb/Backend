import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectToMongoDB from "./services/connectDB.js";
import userModel from "./model/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT;
connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

function isValidName(clientName){
    const regex = /^[A-Za-z]+$/;
    return regex.test(clientName);
}
app.post("/signup", async (req, res)=>{
    try{
        const {name, email, password} = req.body;
        name = name.trim();
        email = email.toLowerCase();

        if(!req.body || !name || !email || !password){
            return res.status(400).json({msg: "all fields are mandatory"});
        }

        if(!isValidName(name)){
            return res.status(400).json({msg: "enter a valid name"});
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({msg: "invalid email"});
        }

        const existingUser = await userModel.findOne({email: email});
        if(existingUser){
            return res.status(400).json({msg: "this email is already registered"});
        }

        if(password.length < 8){
            return res.status(400).json({msg: "the length of password must be greater than 8"});
        }

        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

        const newUser = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        if(newUser){
            return res.status(201).json({msg: "welcome user"});
        }else{
            return res.status(400).json({msg: "can't add new user in the database"});
        }
    }catch(error){
        return res.status(500).json({msg: "internal server error"});
    }
})

app.post("/login", async (req, res)=>{
    try{
        const {email, password} = req.body;

        if(!req.body || !email || !password){
            return res.status(400).json({msg: "all fields are mandatory"});
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({msg: "invalid email"});
        }

        const existingUser = await userModel.findOne({email});
        if(!existingUser){
            return res.status(400).json({msg: "this email is not registered"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({msg: "incorrect password"});
        }

    }catch(error){
        return res.status(500).json({msg: "internal server error"});
    }
})

app.listen(PORT, ()=>{
    console.log(`SERVER is running on PORT: ${PORT}`);
})