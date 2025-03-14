import { type Either, right } from '@/core/function/either'
import type { Order } from '../../enterprise/entities/order'
import type { OrderRepository } from '../repositories/order-repository'

export interface FetchOrderUseCaseRequest {
  page: number
}

type FetchOrderUseCaseResponse = Either<null, { order: Order[] }>

export class FetchOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    page,
  }: FetchOrderUseCaseRequest): Promise<FetchOrderUseCaseResponse> {
    const order = await this.orderRepository.findManyOrder({
      page,
    })

    return right({ order })
  }
}
