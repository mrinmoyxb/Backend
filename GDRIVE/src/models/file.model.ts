import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    s3Key: {
        type: String,
        unique: true,
        required: true,
    },
    bucket: {
        type: String,
        default: "orbitdrive-bucket",
        required: true,
    },
    isFolder: {
        type: Boolean,
        default: false
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "file",
        default: null
    },
    visibility: {
        type: String,
        enum: ["PRIVATE", "SHARED"],
        default: "PRIVATE"
    },
    starred: {
        type: Boolean,
        default: false
    },
    trashed: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["PENDING", "UPLOADED", "FAILED"],
        default: "PENDING"
    }
}, {timestamps: true});

export const fileModel = mongoose.model("file", fileSchema);