import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { Types } from "mongoose";

export function utilCheckValidName(clientName: string): boolean{
    const regex = /^[A-Za-z]+$/;
    return regex.test(clientName);
}

export async function utilHashPassword(password: string): Promise<string>{
    const saltRounds = Number(process.env.SALT_ROUNDS);
    if(!saltRounds){
        throw new Error("INVALID_SALT_ROUNDS");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function utilCheckHashPassword(password: string, exisitingHashedPassword: string): Promise<boolean>{
    const isPasswordValid = await bcrypt.compare(password, exisitingHashedPassword);
    return isPasswordValid;
}

export function utilGetAccessToken(email: string, _id: Types.ObjectId){
    let payload = {
        useremail: email,
        userid: _id.toString()
    }
    const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
        throw new Error("SECRET_ACCESS_TOKEN_MISSING");
    }
    const accessToken = jwt.sign(
        payload,
        ACCESS_TOKEN, {
        expiresIn: "15m"
    });
    return accessToken;
}

export function utilVerifyAccessToken(token: string){
    const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
    if (!ACCESS_TOKEN) {
        throw new Error("SECRET_ACCESS_TOKEN_MISSING");
    }
    const isTokenValid = jwt.verify(token, ACCESS_TOKEN);
    return isTokenValid;
}

export function utilGetRefreshToken(email: string, _id: Types.ObjectId){
    let payload = {
        useremail: email,
        userid: _id.toString()
    }
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
    if (!REFRESH_TOKEN) {
        throw new Error("SECRET_REFRESH_TOKEN_MISSING");
    }
    const refreshToken = jwt.sign(
        payload,
        REFRESH_TOKEN, {
        expiresIn: "30d"
    })
    return refreshToken;
}

export function utilVerifyRefreshToken(token: string){
    const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
    if (!REFRESH_TOKEN) {
        throw new Error("SECRET_REFRESH_TOKEN_MISSING");
    }
    const isTokenValid = jwt.verify(token, REFRESH_TOKEN);
    return isTokenValid;
}

export async function utilHashRefreshToken(token: string): Promise<string>{
    const saltRounds = Number(process.env.SALT_ROUNDS);
    if(!saltRounds){
        throw new Error("INVALID_SALT_ROUNDS");
    }
    const hashedToken = await bcrypt.hash(token, saltRounds);
    return hashedToken;
}

export function utilGenerateOTP(length: number): string{
    const digits: string = "0123456789";
    let otp: string = "";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    for(let i: number = 0; i<length; i++){
        otp += digits[randomValues[i]%10];
    }
    return otp;
}

export async function utilHashOTP(otp: string){
    const saltRounds = Number(process.env.OTP_SALT_ROUNDS);
    if(!saltRounds){
        throw new Error("INVALID_OTP_SALT_ROUNDS");
    }
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    return hashedOTP;
}