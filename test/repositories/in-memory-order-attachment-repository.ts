import { OrderAttachmentRepository } from '@/domain/fast-feet/application/repositories/order-attachment-repository'
import { OrderAttachment } from '@/domain/fast-feet/enterprise/entities/order-attachment'

export class InMemoryOrderAttachmentRepository
  implements OrderAttachmentRepository
{
  public items: OrderAttachment[] = []

  async create(attachment: OrderAttachment): Promise<void> {
    this.items.push(attachment)
  }

  async delete(attachment: OrderAttachment): Promise<void> {
    const attachmentIndex = this.items.findIndex(
      item => item.attachmentId === attachment.id
    )
    this.items.splice(attachmentIndex, 1)
  }

  async findByOrderId(orderId: string): Promise<OrderAttachment | null> {
    const orderAttachment = this.items.find(
      item => item.orderId.toString() === orderId
    )

    if (!orderAttachment) return null

    return orderAttachment
  }
}
