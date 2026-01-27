import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import productModel from "./productsModel";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect("mongodb://127.0.0.1:27017/productsS3")
    .then(()=>console.log("connected to mognoDB"))
    .catch(()=>console.log("not connected"))

//! AWS: 
const client = new S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    }
});

const createPresignedUrlWithClient = ({bucket, key}) => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: mime
    });
    return getSignedUrl(client, command, {expiresIn: 3600});
}

app.post("/api/get-presigned-url", async (req, res)=>{
    const { filename, mime } = req.body;
    const extension = mime.split("/")[1];
    const uid = uuidv4();
    const fileUUID = filename+uid;
    const fname = `${fileUUID}.${extension}`;
    const url = await createPresignedUrlWithClient(
        {
        bucket: process.env.BUCKET_NAME.toString(), 
        key: fname
        }
);
    return res.json({url: url, fileName: fname});
})

//! MongoDB
app.post("/api/product", async (req, res)=>{
    const {productName, productDescription, productPrice, productFileName } = req.body;
    if(!productName || !productDescription || !productPrice || !productFileName){
        return res.status(400).json({msg: "all fields are required"});
    }

    const product = await productModel.create({
        name: productName,
        description: productDescription,
        price: productDescription.price,
        fileName: productFileName
    });

    return res.json({product: product});

})

app.get("/", (req, res)=>{
    return res.send("Hi!! from express server");
})

app.listen(3200, ()=>{
    console.log("SERVER is running on PORT: ", 3200);
})