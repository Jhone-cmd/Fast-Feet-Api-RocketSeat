import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { EditOrderUseCase } from '@/domain/fast-feet/application/use-cases/edit-order'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestEditOrderUseCase extends EditOrderUseCase {
  constructor(orderRepository: OrderRepository) {
    super(orderRepository)
  }
}
