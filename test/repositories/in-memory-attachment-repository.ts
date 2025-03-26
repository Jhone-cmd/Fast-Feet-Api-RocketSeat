import type { AttachmentRepository } from '@/domain/fast-feet/application/repositories/attachment-repository'
import type { Attachment } from '@/domain/fast-feet/enterprise/entities/attachment'

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment): Promise<void> {
    this.items.push(attachment)
  }
}
