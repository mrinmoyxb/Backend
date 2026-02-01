import { S3Client } from "@aws-sdk/client-s3";

export const awsS3Client = new S3Client({
    region: "ap-south-1",
    credentials: process.env.AWS_S3_ACCESS_KEY ? {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string
    }
    : undefined
});



