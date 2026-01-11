import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    const token = jwt.sign(payload, SECRET_KEY);
    return token;
}

function validateToken(token){
    const payload = jwt.verify(token, SECRET_KEY);
    return payload;
}

export default { createTokenForUser, validateToken };