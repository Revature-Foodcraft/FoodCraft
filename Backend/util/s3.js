import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { logger } from './logger'
import 'dotenv/config';

const BUCKET_NAME = process.env.S3_BUCKET_NAME;


const s3Client = new S3Client({
    region: process.env.AWS_DEFAULT_REGION || 'us-east-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Function to upload an image to the S3 bucket
async function uploadImage(key, fileContent, contentType) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: contentType
    });
    await s3Client.send(command);
    logger.info(`Image uploaded successfully to ${BUCKET_NAME}/${key}`);
}

// Function to delete an image from the S3 bucket
async function deleteImage(key) {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });
    await s3Client.send(command);
    logger.info(`Image deleted successfully from ${BUCKET_NAME}/${key}`);
}

// Function to generate a signed URL for an image
async function getSignedImageUrl(key, expiresIn = 3600) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
    });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    logger.info(`Signed URL generated: ${signedUrl}`);
    return signedUrl;
}

export { uploadImage, deleteImage, getSignedImageUrl };
