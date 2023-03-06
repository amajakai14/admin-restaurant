import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "../env.mjs";

export const putObjectPresignedUrl = async (
  customer_id: string,
  menu_id: number
) => {
  const key = `${customer_id}/${menu_id}`;
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    region: "ap-northeast-1",
  });

  const LIMIT_SIZE_10MB = 1e7;
  const url = await createPresignedPost(s3Client, {
    Bucket: env.S3_BUCKET,
    Key: key,
    Conditions: [
      ["starts-with", "$Content-Type", "image/"],
      ["content-length-range", 0, LIMIT_SIZE_10MB],
    ],
    Expires: 30,
  });
  s3Client.destroy();
  return url;
};
