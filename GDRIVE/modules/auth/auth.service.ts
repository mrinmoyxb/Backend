import { userModel } from "../../modules/users/user.model.js"
import { utilHashPassword, utilCheckHashPassword, utilGetAccessToken, utilGetRefreshToken, utilHashRefreshToken, utilVerifyRefreshToken } from "../../utils/authUtil.js";
import bcrypt from "bcrypt";


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


export function serviceAuthRefreshToken(){

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