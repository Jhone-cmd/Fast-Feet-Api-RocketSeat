import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderAttachment } from '@/domain/fast-feet/enterprise/entities/order-attachment'
import { Prisma, Attachments as PrismaAttachment } from '@prisma/client'

export class PrismaOrderAttachmentMapper {
  static toDomain(raw: PrismaAttachment): OrderAttachment {
    if (!raw.orderId) {
      throw new Error('Invalid attachment type')
    }
    return OrderAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        orderId: new UniqueEntityId(raw.orderId),
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma({
    attachmentId,
    orderId,
  }: OrderAttachment): Prisma.AttachmentsUpdateArgs {
    return {
      where: {
        id: attachmentId.toString(),
      },
      data: {
        orderId: orderId.toString(),
      },
    }
  }
}
