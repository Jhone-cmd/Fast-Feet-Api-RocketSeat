import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { FetchOrdersUseCase } from '@/domain/fast-feet/application/use-cases/fetch-orders'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFetchRecentOrdersUseCase extends FetchOrdersUseCase {
  constructor(orderRepository: OrderRepository) {
    super(orderRepository)
  }
}
