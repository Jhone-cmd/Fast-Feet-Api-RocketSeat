import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { Either, left, right } from '@/core/function/either'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { OrderStatus } from '@/domain/fast-feet/enterprise/entities/types/order-status'

export interface OnOrderStatusUseCaseRequest {
  orderId: string
  status: OrderStatus
}

type OnOrderStatusUseCaseResponse = Either<ResourceNotFound, null>

export class OnOrderStatusUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    status,
  }: OnOrderStatusUseCaseRequest): Promise<OnOrderStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) return left(new ResourceNotFound())

    order.status = status ? status : order.status

    await this.orderRepository.save(order)

    return right(null)
  }
}
