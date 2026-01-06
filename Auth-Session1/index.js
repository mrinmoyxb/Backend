const express = require("express");
const validator = require("validator");
const userModel = require("./model/userModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8005;
require("dotenv").config();

mongoose.connect("mongodb://127.0.0.1:27017/auth")
    .then(()=>{
        console.log("MongoDB is running");
    })
    .catch(()=>{
        console.log("MongoDB is not running");
    })

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.set("view engine", "ejs");

//! JWT to authenticate route
const secret_key = '2f66ddd7626733689c0672d04e94bcb87c113bc3bfe4955806f50ef4d137ae8f3d1b62e8562ece9374af2d1d0f4709f9d9808137cda99fefc0b2953ab232adaa';
function authenticateJWT(req, res, next){
    const JWTToken = req.cookies.JWTToken;
    console.log("JWTToken: ", JWTToken);

    if(!JWTToken){
        return res.status(401).json({msg: "Login required"});
    }
    try{
        const decoded = jwt.verify(JWTToken, secret_key); 
        console.log("Decoded: ", decoded);
        req.userId = decoded.userId;
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
    const body = req.body;
    if(!body || !body.name || !body.email || !body.password || !body.code){
        return res.status(400).json({msg: "all fields are required"});
    }

    if(!validator.isEmail(body.email)){
        return res.status(400).json({msg: "enter a valid email"});
    }

    const existingUser = await userModel.findOne({email: body.email});
    if(existingUser){
        return res.status(400).json({msg: "this email is already registered"});
    }

    if(!isValidName(req.body.name)){
        return res.status(400).json({msg: "invalid name"})
    }

    if(body.password.length < 8){
        return res.status(400).json({msg: "the length of password is less than 8"});
    }

    const hashPassword = await bcrypt.hash(body.password, 10);
    const newUser = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        code: req.body.code
    });
    console.log("newuser: ", newUser);
    return res.status(200).json({msg: "welcome, user registered"});
})

//! LOGIN
app.post("/login", async (req, res)=>{
    try{
        const body = req.body;
  
        if(!body || !body.email || !body.password){
            return res.status(400).json({msg: "all fields are required"});
        }

        if(!validator.isEmail(body.email.toLowerCase())){
            return res.status(400).json({msg: "invalid email format"});
        }

        const existingUser = await userModel.findOne({email: body.email.toLowerCase()});
        if(!existingUser){
            return res.status(400).json({msg: "email not found"});
        }

        const isPassMatch = await bcrypt.compare(body.password, existingUser.password);
        if(!isPassMatch){
            return res.status(401).json({msg: "wrong password, try again"});
        }

        //! JWT TOKEN AS COOKIE
        const JWTToken = jwt.sign({userId: existingUser._id, email: existingUser.email},
                                    secret_key,
                                  {expiresIn: "1m"});
        console.log("JWT Token created: ", JWTToken);
        res.cookie("JWTToken", JWTToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 1000
        })

        return res.status(200).redirect("/home");
    }catch(err){
        return res.status(500).json("Internal server error");
    }
})

function getAppUrl(){
     process.env.GOOGLE_CLIENT_ID
}

//! HOME
app.get("/home", authenticateJWT, async (req, res)=>{
    const userId = req.userId;
    const user = await userModel.findById({_id: userId});
    console.log("USER: ", user);
    res.render("home", {
        username: user.name,
        code: user.code
    });
});

app.listen(PORT, ()=>{
    console.log("SERVER IS RUNNING ON PORT: ", PORT);
})