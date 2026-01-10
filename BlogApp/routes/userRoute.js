import { Router } from "express";
import userModel from "../models/userModel.js";

const router = Router();

router.get("/signup", (req, res)=>{
    return res.render("signup");
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
    return res.render("signin");
});

router.post("/signin", async (req, res)=>{
    const { email, password } = req.body;
    const user = userModel.matchPassword(email, password);
    console.log(user);
    return res.redirect("/");
})


export default router;