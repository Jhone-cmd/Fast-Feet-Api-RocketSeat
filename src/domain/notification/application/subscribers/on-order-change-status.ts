import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { OrderChangeStatusEvent } from '@/domain/fast-feet/enterprise/events/order-change-status-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderChangeStatus implements EventHandler {
  constructor(
    private orderRepository: OrderRepository,
    private sendoNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderChangeStatusNotification.bind(this),
      OrderChangeStatusEvent.name
    )
  }

  private async sendOrderChangeStatusNotification({
    order,
  }: OrderChangeStatusEvent) {
    const orderStatus = await this.orderRepository.findById(order.id.toString())

    if (orderStatus) {
      await this.sendoNotification.execute({
        recipientId: order.id.toString(),
        title: `Mudança de status do pedido para ${order.name}`,
        content: `${order.status}`,
      })
    }
  }
}
