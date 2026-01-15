import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectToMongoDB from "./services/connectDB.js";
import userModel from "./model/userModel.js";
import validator from "validator";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT;
connectToMongoDB();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

const authenticateAccessToken = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({msg: "access token missing"});
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN);
        req.userId = decodedToken.userId;
        next();
    }catch(error){
        return res.status(401).json({msg: "Invalid or expired token"});
    }
}

const authenticateRefreshToken = async (req, res, next) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({msg: "Refresh token missing"});
        }

        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const user = {_id: decodedToken.userId, email: decodedToken.email};
        const newAccessToken = genAccessToken(user);
        res.json({accessToken: newAccessToken});
    }catch(error){
        return res.status(500).json({msg: "internal server error"});
    }
}

function genAccessToken(user){
    return jwt.sign(
        {   
            userId: user._id,
            email: user.email
        },
        process.env.ACCESS_TOKEN,
        {expiresIn: "1m"}
    )
};

function genRefreshToken(user){
    return jwt.sign(
        {
            userId: user._id,
            email: user.email
        },
        process.env.REFRESH_TOKEN,
        {expiresIn: "7d"}
    )
};

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

        const accessToken = genAccessToken(existingUser);
        const refreshToken = genRefreshToken(existingUser);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, Number(process.env.SALT));
        await userModel.findOneAndUpdate(
            {id: existingUser._id}, 
            {$set: {refreshToken: hashedRefreshToken}}
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 1*60*60*1000
        });

        return res.status(200).json({msg: "success", accessToken: accessToken});

    }catch(error){
        return res.status(500).json({msg: "internal server error"});
    }
})

app.get("/", authenticate, async(req, res)=>{
    const user = await userModel.findById(req.userId);
    res.render("home", {
        username: user.name
    });
})

app.listen(PORT, ()=>{
    console.log(`SERVER is running on PORT: ${PORT}`);
})