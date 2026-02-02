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
        required: function(this: any): boolean{
            return !this.isFolder
        }
    },
    mimeType: {
        type: String,
        required: function(this: any): boolean{
            return !this.isFolder
        }
    },
    size: {
        type: Number,
        required: function(this: any): boolean{
            return !this.isFolder
        }
    },
    s3Key: {
        type: String,
        unique: true,
        sparse: true,
        required: function(this: any): boolean{
            return !this.isFolder
        }
    },
    bucket: {
        type: String,
        default: "orbitdrive-bucket",
        required: function(this: any): boolean{
            return !this.isFolder
        }
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
    trashedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["PENDING", "UPLOADED", "FAILED"],
        default: "PENDING",
        required: function(this: any): boolean{
            return !this.isFolder
        }
    }
}, {timestamps: true});

export const fileModel = mongoose.model("file", fileSchema);