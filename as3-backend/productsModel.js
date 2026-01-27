import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    }
}, {timestamps: true});

const productModel = mongoose.model("products3", productSchema);
export default productModel;