import express from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../util/s3.js"; // Your existing utility
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

router.get("/generate-upload-url", async (req, res) => {
    const { fileName, fileType } = req.query;
    if (!fileName || !fileType) {
        return res.status(400).json({ message: "Missing fileName or fileType" });
    }

    const key = `uploads/${Date.now()}-${fileName}`; // Raw fileName for S3 key

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType
    });

    try {
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        // Encode the public URL for browser use (spaces -> %20, etc.)
        const encodedKey = encodeURIComponent(key).replace(/%2F/g, "/");
        const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_DEFAULT_REGION}.amazonaws.com/${encodedKey}`;

        return res.status(200).json({ uploadUrl, publicUrl });
    } catch (err) {
        console.error("Signed URL error:", err);
        return res.status(500).json({ message: "Could not generate upload URL" });
    }
});


export default router;
