import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { OnOrderStatusUseCase } from '@/domain/fast-feet/application/use-cases/on-order-status'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestOnOrderStatusUseCase extends OnOrderStatusUseCase {
  constructor(orderRepository: OrderRepository) {
    super(orderRepository)
  }
}
