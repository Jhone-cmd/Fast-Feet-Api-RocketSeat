import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import type { OrderRepository } from '../repositories/order-repository'

export interface DeleteOrderUseCaseRequest {
  recipientId: string
  orderId: string
}

type DeleteOrderUseCaseResponse = Either<ResourceNotFound | NotAllowed, null>

export class DeleteOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    recipientId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) return left(new ResourceNotFound())

    if (recipientId !== order.recipientId.toString()) {
      return left(new NotAllowed())
    }

    await this.orderRepository.delete(order)

    return right(null)
  }
}
