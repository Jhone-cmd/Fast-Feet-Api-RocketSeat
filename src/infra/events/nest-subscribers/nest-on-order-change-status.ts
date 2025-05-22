import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { OnOrderChangeStatus } from '@/domain/notification/application/subscribers/on-order-change-status'
import { Injectable } from '@nestjs/common'
import { NestSendNotificationUseCase } from '../nest-use-cases/nest-send-notification-use-case'

@Injectable()
export class NestOnOrderChangeStatus extends OnOrderChangeStatus {
  constructor(
    orderRepository: OrderRepository,
    sendNotification: NestSendNotificationUseCase
  ) {
    super(orderRepository, sendNotification)
  }
}
