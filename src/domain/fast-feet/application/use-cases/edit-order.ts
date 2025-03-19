import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import type { OrderStatus } from '../../enterprise/entities/types/order-status'
import type { OrderRepository } from '../repositories/order-repository'

export interface EditOrderUseCaseRequest {
  recipientId: string
  orderId: string
  name?: string
  status?: OrderStatus
}

type EditOrderUseCaseResponse = Either<ResourceNotFound | NotAllowed, null>

export class EditOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    recipientId,
    name,
    status,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) return left(new ResourceNotFound())

    if (recipientId !== order.recipientId.toString()) {
      return left(new NotAllowed())
    }

    order.name = name ? name : order.name
    order.status = status ? status : order.status

    await this.orderRepository.save(order)

    return right(null)
  }
}
