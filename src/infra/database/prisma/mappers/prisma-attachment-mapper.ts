import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/fast-feet/enterprise/entities/attachment'
import { Prisma, Attachments as PrismaAttachment } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attachment {
    return Attachment.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    attachment: Attachment
  ): Prisma.AttachmentsUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
