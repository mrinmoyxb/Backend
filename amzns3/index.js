import dotenv from "dotenv";
dotenv.config();

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    }
})

async function getObjectURL(key){
    const command = new GetObjectCommand({
        Bucket: "orbit-amzn-s3",
        Key: key,
    });

    const url = getSignedUrl(s3Client, command);
    return url;
}

async function putObject(fileName, contentType) {
    const command = new PutObjectCommand({
        Bucket: 'orbit-amzn-s3',
        Key: `/uploads/user-uploads/${fileName}`,
        ContentType: contentType
    });
    const url = getSignedUrl(s3Client, command);
    return url;
}

async function init(){
    // console.log("URL for pdf: ", await getObjectURL("GenAI.pdf"));
    console.log("URL to upload: ", await putObject(`image-${Date.now()}.png`, 'image/png'));
}

init();

