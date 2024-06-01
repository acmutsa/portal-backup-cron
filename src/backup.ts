import { exec } from "child_process";
import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { createReadStream } from "fs";
import { checkin, checkout } from "./sentry";

import { env } from "./env";
import { stat } from "fs/promises";

const clientOptions: S3ClientConfig = {
  region: env.AWS_S3_REGION,
};

// This is required for using an S3-compatible service, such as Cloudflare R2 as in our case.
if (env.AWS_S3_ENDPOINT) {
  console.log(`Using custom endpoint: ${env.AWS_S3_ENDPOINT}`);
  clientOptions.endpoint = env.AWS_S3_ENDPOINT;
}

const client = new S3Client(clientOptions);

const uploadToS3 = async ({ name: key, path }: { name: string; path: string }) => {
  console.log(`Uploading ${path} to S3/${env.AWS_S3_BUCKET}/${key}...`);

  const bucket = env.AWS_S3_BUCKET;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: createReadStream(path),
    })
  );

  console.log("Backup uploaded to S3...");
};

const dumpToFile = async (path: string) => {
  console.log("Dumping DB to file...");

  await new Promise((resolve, reject) => {
    exec(
      `pg_dump ${env.BACKUP_DATABASE_URL} -F t | gzip > ${path}`,
      (error, stdout, stderr) => {
        if (error) {
          reject({ error: JSON.stringify(error), stderr });
          return;
        }

        resolve(undefined);
      }
    );
  });

  console.log("DB dumped to file...");
};

export const backup = async () => {
  console.log("Initiating DB backup...");

  let date = new Date().toISOString();
  const timestamp = date.replace(/[:.]+/g, "-");
  const filename = `backup-${timestamp}.tar.gz`;
  const filepath = `/tmp/${filename}`;

  const { check_in_id, startTime } = await checkin();
  if (check_in_id == undefined)
    console.log("Error: Failed to checkin to Sentry Cron API.");
  
  let error = null;
  try {
    await dumpToFile(filepath);

    // Check the filesize of the backup
    const stats = await stat(filepath);
    console.log(`Dumped database size: ${stats.size} bytes`)
    if (stats.size < 16 * 1024) {
      throw new Error("Error: backup file size is less than 16KB, upload is not feasibly useful and is unlikely to be a valid backup.");
    }

    await uploadToS3({ name: filename, path: filepath });
  } catch (e) {
    console.log(`Error: ${e instanceof Error ? e.message : "Unknown"}`);
    error = e;
  }

  const duration = new Date().getTime() - startTime.getTime();
  await checkout(check_in_id ?? null, error == null);

  console.log(`Backup completed in ${duration}ms.`);
};
