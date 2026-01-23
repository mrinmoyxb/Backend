import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";

export function utilCheckValidName(clientName: string): boolean{
    const regex = /^[A-Za-z]+$/;
    return regex.test(clientName);
}

export async function utilHashPassword(password: string): Promise<string>{
    const saltRounds = Number(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function utilCheckHashPassword(password: string, exisitingHashedPassword: string): Promise<boolean>{
    const isPasswordCorrect = await bcrypt.compare(password, exisitingHashedPassword);
    return isPasswordCorrect;
}