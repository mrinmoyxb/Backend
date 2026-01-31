import { type Request, type Response } from "express";
import { utilCheckValidName, utilCheckLengthOfEachParameter, utilGetNewAccessToken, utilVerifyResetOTPToken } from '../../utils/auth.util.ts';
import validator from "validator";
import { serviceAuthForgotPassword, serviceAuthLogin, serviceAuthLogout, serviceAuthRegister, serviceAuthVerifyOTP, serviceResetPassword } from "./auth.service.ts";

interface ForgotPasswordRequest extends Request{
    userId?: string
}

interface AuthenticatedRequest extends Request {
    userId?: string;
}

export async function setRegisterUser(req: Request, res: Response){
    try{
        let {fname, lname, email, password} = req.body as {
            fname?: string,
            lname?: string,
            email?: string,
            password?: string
        }

        if(!fname || !lname || !email || !password){
            return res.status(400).json({msg: "all fields are required"});
        }
        
        const normalizedMail = email.toLowerCase();

        if(!utilCheckValidName(fname)){
            return res.status(400).json({msg: "provide a valid first name"});
        }

        if(!utilCheckValidName(lname)){
            return res.status(400).json({msg: "provide a valid last name"});
        }
        
        fname = utilCheckLengthOfEachParameter(fname, "fname");
        lname = utilCheckLengthOfEachParameter(lname, "lname");
        email = utilCheckLengthOfEachParameter(email, "email");

        if(!validator.isEmail(normalizedMail)){
            return res.status(400).json({msg: "invalid email address"});
        }
        
        const result = await serviceAuthRegister(fname, lname, normalizedMail, password);
        return res.status(201).json({msg: "user registered successfully", email: result.userEmail});

    }catch(error: any){
        if(error.message === "EMAIL_ALREADY_EXISTS"){
            return res.status(400).json({ msg: "this email is already registered" });
        }
        if(error.message === "UNSUPPORTED_LENGTH"){
            return res.status(400).json({ msg: "the length of the password is not within the range" });
        }
        return res.status(500).json({msg: "internal server error"});
    }

}

export async function setLoginUser(req: Request, res: Response){
    try{
        const { email, password } = req.body as {
            email?: string,
            password?: string
        }

        if (!email || !password) {
            return res.status(400).json({ msg: "all fields are required" });
        }

        const normalizedMail = email.toLowerCase();

        if (!validator.isEmail(normalizedMail)) {
            return res.status(400).json({ msg: "invalid credentials" });
        }

        const result = await serviceAuthLogin(normalizedMail, password);
        const { accessToken, refreshToken } = result;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 60 * 60 * 1000
        })
        return res.status(201).json({msg: "user logged successfully", accessToken: accessToken});
        
    }catch(error: any){
        if(error.message === "EMAIL_NOT_REGISTERED"){
            return res.status(400).json({msg: "invalid credentials, email not registered"});
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

export async function setNewAccessTokenUser(req: AuthenticatedRequest, res: Response){
    const userId = req.userId;
    if(!userId){
        return res.status(404).json({msg: "invalid user id"});
    }

    const newAccessToken = await utilGetNewAccessToken(userId as string);
    return res.status(200).json({accessToken: newAccessToken, msg: "new access token!!!"});
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

export async function setForgotPassword(req: ForgotPasswordRequest, res: Response){
    try{
        const { email } = req.body;

        if(!email){
            return res.status(400).json({msg: "provide your registered email"});
        }

        const normalizedMail = email.toLowerCase();
        await serviceAuthForgotPassword(normalizedMail);

        return res.status(200).json({msg: "OTP sent"});

    }catch(error: any){
        if(error==="INVALID_EMAIL"){
            return res.status(404).json({msg: "email not found"});
        }
        if(error==="SEND_EMAIL_FAILED"){
            return res.status(401).json({msg: "couldn't send mail to the user"});
        }
        if(error==="UPDATE_OTP_FAILED"){
            return res.status(401).json({msg: "couldn't update OTP"});
        }
        return res.status(500).json({msg: "internal server error"});
    }
}

export async function setVerifyOTP(req: ForgotPasswordRequest, res: Response){
    try{ 
        const { email, otp } = req.body;

        if(!otp || !email){
            return res.status(400).json({msg: "invalid credentials"});
        }

        const resetToken =  await serviceAuthVerifyOTP(otp, email);
        return res.status(200).json({msg: "OTP verified successfully", resetToken: resetToken});

    }catch(error: any){
        if(error==="USER_NOT_FOUND"){
            return res.status(404).json({msg: "userid not found"});
        }
        if(error==="OTP_MISMATCH"){
            return res.status(400).json({msg: "otp mismatch"});
        }
        if(error.message === "SECRET_OTP_RESET_TOKEN_MISSING"){
            return res.status(401).json({msg: "secret otp token missing"});
        }
        return res.status(500).json({msg: "internal server error"});
    }
}

export async function setNewPassword(req: ForgotPasswordRequest, res: Response){
    try{
        const { resetToken, newPassword, confirmPassword } = req.body;
        console.log("token: ", resetToken);
        if(!newPassword || !confirmPassword || !resetToken){
            return res.status(400).json({msg: "all fields are required"});
        }
        
        if(newPassword!==confirmPassword){
            return res.status(400).json({msg: "password mismatch"});
        }
        
        const verifiedToken = utilVerifyResetOTPToken(resetToken) as any;
        if(!verifiedToken){
            return res.status(401).json({msg: "invalid reset otp token"});
        }
 
        await serviceResetPassword(verifiedToken.useremail, newPassword);
        return res.status(200).json({msg: "password reset successfull"});

    }catch(error: any){
        if(error.message === "UNSUPPORTED_LENGTH"){
            return res.status(400).json({ msg: "the length of the password is not within the range" });
        }
        if(error==="USER_NOT_FOUND"){
            return res.status(404).json({msg: "userid not found"});
        }
        if(error==="EXPIRED_TOKEN"){
            return res.status(404).json({msg: "expired token"});
        }
        return res.status(500).json({msg: "internal server error"});
    }
}