import { type Either, right } from '@/core/function/either'
import type { Order } from '../../enterprise/entities/order'
import type { OrderRepository } from '../repositories/order-repository'

export interface FetchOrdersUseCaseRequest {
  page: number
}

type FetchOrdersUseCaseResponse = Either<null, { orders: Order[] }>

export class FetchOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    page,
  }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const orders = await this.orderRepository.findManyOrder({
      page,
    })

    return right({ orders })
  }
}
