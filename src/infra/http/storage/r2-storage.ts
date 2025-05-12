import {
  UploadParams,
  Uploader,
} from '@/domain/fast-feet/application/storage/uploader'
import { Env } from '@/infra/env'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'node:crypto'

export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private env: ConfigService<Env, true>) {
    this.client = new S3Client({
      endpoint: `https://${env.get('CLOUDFLARE_ACCOUNT_ID', { infer: true })}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.get('AWS_Access_Key_ID', { infer: true }),
        secretAccessKey: env.get('AWS_Secret_Access_Key', { infer: true }),
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.env.get('AWS_BUCKET_NAME', { infer: true }),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      })
    )

    return { url: uniqueFileName }
  }
}
