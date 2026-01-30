import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "first name must be at least 3 characters long"],
        maxLength: [50, "first name cannot exceed 50 characters"]
    },
    lname: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, 'last name must be at least 3 characters long'],
        maxLength: [50, "last name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: [254, "email cannot exceed 254 characters"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, 'password must be at least 8 characters long'],
        maxLength: [12, "password cannot exceed 12 characters"]
    },
    refreshToken: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    },
    resetOTP: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

export const userModel = mongoose.model("user", userSchema);