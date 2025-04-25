import { OrderAttachmentRepository } from '@/domain/fast-feet/application/repositories/order-attachment-repository'
import { OrderAttachment } from '@/domain/fast-feet/enterprise/entities/order-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaOrderAttachmentMapper } from '../mappers/prisma-order-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrderAttachmentRepository
  implements OrderAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(attachment: OrderAttachment): Promise<void> {
    if (!attachment) {
      return
    }

    const data = PrismaOrderAttachmentMapper.toPrisma(attachment)
    await this.prisma.attachments.update(data)
  }

  async delete(attachment: OrderAttachment): Promise<void> {
    if (!attachment) {
      return
    }

    const { data } = PrismaOrderAttachmentMapper.toPrisma(attachment)
    const id = data.id?.toString()

    await this.prisma.attachments.delete({
      where: {
        id,
      },
    })
  }

  async findByOrderId(orderId: string): Promise<OrderAttachment | null> {
    const orderAttachment = await this.prisma.attachments.findFirst({
      where: {
        orderId,
      },
    })

    if (!orderAttachment) return null

    return PrismaOrderAttachmentMapper.toDomain(orderAttachment)
  }
}
