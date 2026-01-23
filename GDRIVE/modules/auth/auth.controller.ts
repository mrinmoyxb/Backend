import express from "express";
import { type Request, type Response } from "express";
import { userModel } from "../../modules/users/user.model.js"

export async function setRegisterUser(req: Request, res: Response){
    const {name, email, password} = req.body;

    if(!req.body || !name || !email || !password){
        return res.status(400).json({msg: "all fields are required"});
    }

    const newUser = await userModel.create({
        name: name,
        email: email,
        password: password
    })

}

export function setLoginUser(){

}

export function setLogoutUser(){

}

export function getUser(){

}