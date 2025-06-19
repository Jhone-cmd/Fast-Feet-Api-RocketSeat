import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  OrderAttachment,
  OrderAttachmentProps,
} from '@/domain/fast-feet/enterprise/entities/order-attachment'
import { PrismaOrderAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-order-attachment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeOrderAttachment(
  override: Partial<OrderAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const orderAttachment = OrderAttachment.create(
    {
      orderId: new UniqueEntityId(),
      attachmentId: new UniqueEntityId(),
      ...override,
    },
    id
  )

  return orderAttachment
}

@Injectable()
export class OrderAttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrderAttachment(
    data: Partial<OrderAttachmentProps> = {}
  ): Promise<OrderAttachment> {
    const orderAttachment = makeOrderAttachment(data)
    const dataOrderAttachment =
      PrismaOrderAttachmentMapper.toPrisma(orderAttachment)

    await this.prisma.attachments.update(dataOrderAttachment)

    return orderAttachment
  }
}
