import mongoose from "mongoose";
import { createHmac } from "crypto";

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
        type: String,
        required: true
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

userSchema.pre("save", function(next) {
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(64).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;

    next();
})

const userModel = mongoose.model("user", userSchema);
export default userModel;