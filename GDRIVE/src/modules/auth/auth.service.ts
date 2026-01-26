import { userModel } from "../users/user.model.ts"
import { utilHashPassword, utilCheckHashPassword, utilGetAccessToken, utilGetRefreshToken, utilHashRefreshToken, utilVerifyRefreshToken, utilGenerateOTP, utilHashOTP, utilSendOTPMail } from "../../utils/authUtil.ts";
import bcrypt from "bcrypt";
import { Types } from "mongoose";


export async function serviceAuthRegister(username: string, useremail: string, userpassword: string) {
    const existingUser = await userModel.findOne({ email: useremail });
    if (existingUser) {
        throw Error("EMAIL_EXISTS");
    }

    if (!(userpassword.length >= 8 && userpassword.length <= 12)) {
        throw new Error("UNSUPPORTED_LENGTH");
    }

    const hashedPassword = await utilHashPassword(userpassword);

    const newUser = await userModel.create({
        name: username,
        email: useremail,
        password: hashedPassword
    });

    return {
        userEmail: newUser.email
    };
}

export async function serviceAuthLogin(useremail: string, userpassword: string) {
    const existingUser = await userModel.findOne({ email: useremail });
    if (!existingUser) {
        throw new Error("INVALID_EMAIL");
    }

    const hashedPassword = await utilCheckHashPassword(userpassword, existingUser.password);
    if (!hashedPassword) {
        throw new Error("INVALID_PASSWORD");
    }

    const accessToken = utilGetAccessToken(existingUser.email, existingUser._id);
    const refreshToken = utilGetRefreshToken(existingUser.email, existingUser._id);
    const hashedToken = await utilHashRefreshToken(refreshToken);
    await userModel.findOneAndUpdate(
        existingUser._id,
        {$set: {refreshToken: hashedToken}}
    );

    return {
        accessToken, 
        refreshToken,
        user: {
            id: existingUser._id,
            email: existingUser.email
        }
    }
}

export async function serviceAuthLogout(refreshToken: any){
    const decodedToken = utilVerifyRefreshToken(refreshToken) as any;

    const user = await userModel.findById(decodedToken.userid);
    if (!user || !user.refreshToken) {
        throw new Error("INVALID_REFRESH_TOKEN_FROM_USER");
    }

    const isValidRefreshToken = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValidRefreshToken) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }

    const check = await userModel.findByIdAndUpdate(
        user._id,
        {
            $set: { refreshToken: null }
        });
}

export async function serviceAuthForgotPassword(useremail: string): Promise<Types.ObjectId>{
    const isUser = await userModel.findOne({email: useremail});
    
    if(!isUser){
        throw new Error("INVALID_EMAIL");
    }

    const otp = utilGenerateOTP(4);
    const hashedOTP = await utilHashOTP(otp);

    await userModel.findByIdAndUpdate(isUser._id,
        {$set: {
            resetOTP: hashedOTP
        }}
    )

    await utilSendOTPMail(useremail, otp);
    return isUser._id;
}

export async function serviceAuthVerifyOTP(otp: string, userId: string){
    const isUser = await userModel.findById(userId);
    if(!isUser){
        throw new Error("USER_NOT_FOUND");
    }

    const hashedOTP = await bcrypt.compare(otp, isUser.resetOTP);
    if(hashedOTP){
        throw new Error("OTP_MISMATCH");
    }
}

export async function serviceResetPassword(userId: string, newPassword: string){
    
    if (!(newPassword.length >= 8 && newPassword.length <= 12)) {
        throw new Error("UNSUPPORTED_LENGTH");
    }
    
    const isUser = await userModel.findById(userId);
    if(!isUser){
        throw new Error("USER_NOT_FOUND");
    }

    await userModel.updateOne(isUser._id,
        {$set: {
            password: newPassword
        }}
    )
}