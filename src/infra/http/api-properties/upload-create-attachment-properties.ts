import { ApiProperty } from '@nestjs/swagger'

export class UploadCreateAttachmentProperties {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file!: Express.Multer.File
}
