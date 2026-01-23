import { type Request, type Response } from "express";
import { userModel } from "../../modules/users/user.model.js"
import { utilCheckValidName, utilHashPassword, utilCheckHashPassword } from "../../utils/authUtil.js";
import validator from "validator";

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

        const existingUser = await userModel.findOne({email: normalizedMail});
        if(existingUser){
            return res.status(400).json({msg: "invalid credentials"});
        }

        if(!(userpassword.length>=8 && userpassword.length<=12)){
            return res.status(400).json({msg: "length of password is not within the range"});
        }

        const hashedPassword = await utilHashPassword(userpassword);

        const newUser = await userModel.create({
            name: username,
            email: normalizedMail,
            password: hashedPassword
        });
        console.log(newUser);
        return res.status(201).json({msg: "user registered successfully"});

    }catch(error){
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

        const existingUser = await userModel.findOne({ email: normalizedMail });
        if (!existingUser) {
            return res.status(400).json({ msg: "invalid email" });
        }
        
        const hashedPassword = await utilCheckHashPassword(userpassword, existingUser.password);
        if (!hashedPassword) {
            return res.status(400).json({ msg: "incorrect password" });
        }
    }catch(error){
        return res.status(500).json({msg: "internal server error"});
    }
}

export function setLogoutUser(){

}

export function getUser(){

}