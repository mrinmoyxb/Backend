import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";
import createTokenForUser from "../services/authenticate.js";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    profileImgURL: {
        type: String,
        default: "/images/profile.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, {timestamps: true});

userSchema.pre("save", async function() {
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(64).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;
});

userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
    if(hashedPassword === userProvidedPassword){
        const token = createTokenForUser(user);
        return token;
    }else{
        throw Error("Wrong password");
    }
})

const userModel = mongoose.model("user", userSchema);
export default userModel;