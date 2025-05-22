import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { OnOrderChangeStatus } from '@/domain/notification/application/subscribers/on-order-change-status'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestOnOrderChangeStatus extends OnOrderChangeStatus {
  constructor(
    orderRepository: OrderRepository,
    sendNotification: SendNotificationUseCase
  ) {
    super(orderRepository, sendNotification)
  }
}
