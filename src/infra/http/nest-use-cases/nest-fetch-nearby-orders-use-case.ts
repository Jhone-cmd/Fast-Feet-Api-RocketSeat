import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { FetchNearbyOrdersUseCase } from '@/domain/fast-feet/application/use-cases/fetch-nearby-orders'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFetchNearbyOrdersUseCase extends FetchNearbyOrdersUseCase {
  constructor(orderRepository: OrderRepository) {
    super(orderRepository)
  }
}
