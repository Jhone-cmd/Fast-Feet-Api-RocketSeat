import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import { Order } from '../../enterprise/entities/order'
import type { OrderRepository } from '../repositories/order-repository'
import type { RecipientRepository } from '../repositories/recipient-repository'

export interface CreateOrderUseCaseRequest {
  name: string
  recipientId: string
  latitude: number
  longitude: number
}

type CreateOrderUseCaseResponse = Either<ResourceNotFound, { order: Order }>

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository
  ) {}

  async execute({
    name,
    recipientId,
    latitude,
    longitude,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFound())
    }

    const order = Order.create({
      name,
      recipientId: new UniqueEntityId(recipientId),
      status: 'waiting',
      latitude,
      longitude,
    })

    await this.orderRepository.create(order)

    return right({ order })
  }
}
