import { type Request, type Response } from "express";
import { utilCheckValidName, utilGenerateOTP, utilHashOTP, utilHashPassword, utilHashRefreshToken, utilVerifyRefreshToken } from '../../utils/authUtil.js'
import validator from "validator";
import { serviceAuthLogin, serviceAuthLogout, serviceAuthRegister } from "./auth.service.js";
import { userModel } from "../users/user.model.js";
import { rmSync } from "node:fs";

export async function setRegisterUser(req: Request, res: Response){
    try{
        const {username, useremail, userpassword} = req.body as {
            username?: string,
            useremail?: string,
            userpassword?: string
        }

        if(!username || !useremail || !userpassword){
            return res.status(400).json({msg: "all fields are required"});
        }

        const normalizedMail = useremail.toLowerCase();

        if(!utilCheckValidName(username)){
            return res.status(400).json({msg: "provide a valid name"});
        }

        if(!validator.isEmail(normalizedMail)){
            return res.status(400).json({msg: "invalid email address"});
        }

        const result = await serviceAuthRegister(username, normalizedMail, userpassword);
        return res.status(201).json({msg: "user registered successfully", email: result.userEmail});

    }catch(error: any){
        if(error.message === "EMAIL_EXISTS"){
            return res.status(400).json({ msg: "email already registered" });
        }
        if(error.message === "UNSUPPORTED_LENGTH"){
            return res.status(400).json({ msg: "the length of the password is not within the range" });
        }
        return res.status(500).json({msg: "internal server error"});
    }

}

export async function setLoginUser(req: Request, res: Response){
    try{
        const { useremail, userpassword } = req.body as {
            useremail?: string,
            userpassword?: string
        }

        if (!useremail || !userpassword) {
            return res.status(400).json({ msg: "all fields are required" });
        }

        const normalizedMail = useremail.toLowerCase();

        if (!validator.isEmail(normalizedMail)) {
            return res.status(400).json({ msg: "invalid credentials" });
        }

        const result = await serviceAuthLogin(normalizedMail, userpassword);
        const {accessToken, refreshToken, user} = result;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 60 * 60 * 1000
        })
        return res.status(201).json({msg: "user logged successfully", accessToken: accessToken});
        
    }catch(error: any){
        if(error.message === "INVALID_EMAIL"){
            return res.status(400).json({msg: "invalid credentials"});
        }
        if(error.message === "INVALID_PASSWORD"){
            return res.status(400).json({msg: "incorrect password"});
        }
        if(error.message === "SECRET_ACCESS_TOKEN_MISSING"){
            return res.status(401).json({msg: "secret access token missing"});
        }
        if(error.message === "SECRET_REFRESH_TOKEN_MISSING"){
            return res.status(401).json({msg: "secret refresh token missing"});
        }
        if(error.message === "INVALID_SALT_ROUNDS"){
            return res.status(400).json({msg: "invalid salt rounds"});
        }
        return res.status(500).json({msg: "internal server error"});
    }
}

export async function setLogoutUser(req: Request, res: Response){
    try{
        const refreshToken  = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ msg: "missing refresh token" });
        }

        await serviceAuthLogout(refreshToken);

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: true
        })
        return res.status(200).json({ msg: "logout successful" });
    }catch (error: any){
        if(error.message === "INVALID_REFRESH_TOKEN_FROM_USER"){
            return res.status(401).json({msg: "invalid refresh token from user"});
        }
        if(error.message === "INVALID_REFRESH_TOKEN"){
            return res.status(401).json({msg: "mismatch refresh token"});
        }
        return res.status(500).json({msg: "internal server error"});
    }
}

export async function setForgotPassword(req: Request, res: Response){
    const { useremail } = req.body.email;

    const normalizedMail = useremail.toLowerCase();

    const isUser = await userModel.findOne({email: normalizedMail});

    if(!isUser){
        return res.status(404).json({msg: "email not registered"});
    }

    const OTP = utilGenerateOTP(4);
    const hashedOTP = await utilHashOTP(OTP);

    await userModel.findByIdAndUpdate(isUser._id, {
        $set: {resetOTP: hashedOTP}
    })

    return res.status(200)

}

export function getUser(){

}