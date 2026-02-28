import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const isS3Enabled = process.env.S3_ENABLED === "true";

let s3Client: S3Client | null = null;

if (isS3Enabled) {
  const config: ConstructorParameters<typeof S3Client>[0] = {
    region: process.env.S3_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  };

  // Support custom endpoints (MinIO, Cloudflare R2, DigitalOcean Spaces, etc.)
  if (process.env.S3_ENDPOINT) {
    config.endpoint = process.env.S3_ENDPOINT;
    config.forcePathStyle = true;
  }

  s3Client = new S3Client(config);
}

export async function uploadToS3(
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `uploads/${nanoid()}/${filename}`;

  if (!isS3Enabled || !s3Client) {
    // Fall back to local storage
    const fs = await import("fs/promises");
    const path = await import("path");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, `${nanoid()}-${filename}`);
    await fs.writeFile(filePath, file);
    return `/uploads/${path.basename(filePath)}`;
  }

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: "public-read",
  });

  await s3Client.send(command);

  if (process.env.S3_ENDPOINT) {
    return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}`;
  }
  return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
}

export async function deleteFromS3(url: string): Promise<void> {
  if (!isS3Enabled || !s3Client) return;

  const key = url.split(".amazonaws.com/")[1] || url.split(`${process.env.S3_BUCKET}/`)[1];
  if (!key) return;

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  });

  await s3Client.send(command);
}

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string
): Promise<{ url: string; key: string }> {
  if (!isS3Enabled || !s3Client) {
    throw new Error("S3 is not enabled");
  }

  const key = `uploads/${nanoid()}/${filename}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { url, key };
}

export { isS3Enabled };
