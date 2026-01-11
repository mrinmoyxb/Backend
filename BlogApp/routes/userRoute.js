import { Router } from "express";
import userModel from "../models/userModel.js";

const router = Router();

router.get("/signup", (req, res)=>{
    return res.render("signup.ejs");
});

router.post("/signup", async (req, res)=>{
    const {fullName, email, password} = req.body;
    await userModel.create({
        fullName,
        email,
        password
    });
    return res.redirect("/");
})

router.get("/signin", (req, res)=>{
    return res.render("signin.ejs");
});

router.post("/signin", async (req, res)=>{
    try{
        const {email, password} = req.body;
        const token = userModel.matchPasswordAndGenerateToken(email, password);
        console.log("TOKEN GENERATED: ", token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: "1m"
        })
        return res.redirect("/");
    }catch(error){
        return res.render("signin.ejs", {
            error: "incorrect email and password"
        })
    }
})


export default router;