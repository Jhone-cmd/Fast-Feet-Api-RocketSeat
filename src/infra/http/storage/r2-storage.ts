import {
  UploadParams,
  Uploader,
} from '@/domain/fast-feet/application/storage/uploader'
import { EnvService } from '@/infra/env/env.service'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private env: EnvService) {
    this.client = new S3Client({
      endpoint: `https://${env.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.get('AWS_Access_Key_ID'),
        secretAccessKey: env.get('AWS_Secret_Access_Key'),
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
        Bucket: this.env.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      })
    )

    return { url: uniqueFileName }
  }
}
