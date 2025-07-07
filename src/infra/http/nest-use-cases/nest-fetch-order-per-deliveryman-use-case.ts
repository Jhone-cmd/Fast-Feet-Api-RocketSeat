import { Injectable } from '@nestjs/common'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { FetchOrdersPerDeliveryManUseCase } from '@/domain/fast-feet/application/use-cases/fetch-orders-per-deliveryman'

@Injectable()
export class NestFetchOrdersPerDeliveryManUseCase extends FetchOrdersPerDeliveryManUseCase {
  constructor(orderRepository: OrderRepository) {
    super(orderRepository)
  }
}
