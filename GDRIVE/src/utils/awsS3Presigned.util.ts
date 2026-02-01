import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { awsS3Client } from "./awsS3Client.util.ts";

export function utilGeneratePresignedURL(key: string, mime: string){
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET as string,
        Key: key,
        ContentType: mime
    });
    return getSignedUrl(awsS3Client, command, {
        expiresIn: 60
    });
}