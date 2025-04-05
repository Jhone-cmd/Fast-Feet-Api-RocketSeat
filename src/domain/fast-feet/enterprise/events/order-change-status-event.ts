import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'
import type { Order } from '../entities/order'
import type { OrderStatus } from '../entities/types/order-status'

export class OrderChangeStatusEvent implements DomainEvent {
  occurredAt: Date
  order: Order
  status: OrderStatus

  constructor(order: Order, status: OrderStatus) {
    this.order = order
    this.status = status
    this.occurredAt = new Date()
  }

  public getAggregatedId(): UniqueEntityId {
    return this.order.id
  }
}
