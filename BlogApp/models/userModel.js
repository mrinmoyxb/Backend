import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";

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
    profileImg: {
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

userSchema.static("matchPassword", async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");
    if(hashedPassword === userProvidedPassword){
        return {...user, password: undefined, salt: undefined};
    }else{
        throw new Error("Wrong password");
    }
})

const userModel = mongoose.model("user", userSchema);
export default userModel;