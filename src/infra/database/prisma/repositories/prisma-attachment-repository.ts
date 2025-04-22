import { AttachmentRepository } from '@/domain/fast-feet/application/repositories/attachment-repository'
import { Attachment } from '@/domain/fast-feet/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  create(attachment: Attachment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
