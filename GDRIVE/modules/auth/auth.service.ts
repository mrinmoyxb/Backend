import { userModel } from "../../modules/users/user.model.js"
import { utilHashPassword, utilCheckHashPassword } from "../../utils/authUtil.js";


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

    return {
        userEmail: existingUser.email
    };
}