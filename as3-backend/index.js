import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const app = express();

console.log("Access Key: ", process.env.ACCESS_KEY);
console.log("Secret Key: ", process.env.SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const client = new S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY
    }
});

const createPresignedUrlWithClient = ({bucket, key}) => {
    const command = new PutObjectCommand({Bucket: bucket, Key: key});
    return getSignedUrl(client, command, {expiresIn: 3600});
}

app.get("/api/get-presigned-url", async (req, res)=>{
    const url = await createPresignedUrlWithClient({bucket: process.env.BUCKET_NAME.toString(), key: `file: ${Date.now()}.png`});
    return res.json({url: url});
})

app.get("/", (req, res)=>{
    return res.send("Hi!! from express server");
})

app.listen(3200, ()=>{
    console.log("SERVER is running on PORT: ", 3200);
})