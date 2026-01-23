import { type Request, type Response } from "express";
import { utilCheckValidName } from '../../utils/authUtil.js'
import validator from "validator";
import { serviceAuthLogin, serviceAuthRegister } from "./auth.service.js";

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
        return res.status(201).json({msg: "user logged successfully", email: result.userEmail});
        
    }catch(error: any){
        if(error.message === "INVALID_EMAIL"){
            return res.status(400).json({msg: "invalid credentials"});
        }
        if(error.message === "INVALID_PASSWORD"){
            return res.status(400).json({msg: "incorrect password"});
        }
        return res.status(500).json({msg: "internal server error"});
    }
}

export function setLogoutUser(){

}

export function getUser(){

}