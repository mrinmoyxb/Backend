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
        required: true,
        unique: true
    },
    bucket: {
        type: String,
        required: true
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
        enum: ["private", "shared"],
        default: "private"
    },
    checksum: {
        type: String
    },
    starred: {
        type: Boolean,
        default: false
    },
    trashed: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export const fileModel = mongoose.model("file", fileSchema);