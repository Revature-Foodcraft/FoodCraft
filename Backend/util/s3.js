
const REGION = process.env.AWS_DEFAULT_REGION;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const s3 = new S3Client({ region: REGION });