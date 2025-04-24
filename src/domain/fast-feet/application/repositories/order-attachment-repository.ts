import { OrderAttachment } from '../../enterprise/entities/order-attachment'

export interface OrderAttachmentRepository {
  create(attachment: OrderAttachment): Promise<void>
  delete(attachment: OrderAttachment): Promise<void>
  findByOrderId(orderId: string): Promise<OrderAttachment | null>
}
