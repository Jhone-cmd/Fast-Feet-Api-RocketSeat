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
    const data = PrismaOrderAttachmentMapper.toPrisma(attachment)
    await this.prisma.attachments.create({
      data,
    })
  }

  async delete(attachment: OrderAttachment): Promise<void> {
    const data = PrismaOrderAttachmentMapper.toPrisma(attachment)
    await this.prisma.attachments.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findByOrderId(orderId: string): Promise<OrderAttachment | null> {
    const orderAttachment = await this.prisma.attachments.findUnique({
      where: {
        orderId,
      },
    })

    if (!orderAttachment) return null

    return PrismaOrderAttachmentMapper.toDomain(orderAttachment)
  }
}
