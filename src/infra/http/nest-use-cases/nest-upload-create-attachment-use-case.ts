import { AttachmentRepository } from '@/domain/fast-feet/application/repositories/attachment-repository'
import { Uploader } from '@/domain/fast-feet/application/storage/uploader'
import { UploadAndCreateAttachmentUseCase } from '@/domain/fast-feet/application/use-cases/upload-and-create-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestUploadAndCreateAttachmentUseCase extends UploadAndCreateAttachmentUseCase {
  constructor(attachmentRepository: AttachmentRepository, uploader: Uploader) {
    super(attachmentRepository, uploader)
  }
}
