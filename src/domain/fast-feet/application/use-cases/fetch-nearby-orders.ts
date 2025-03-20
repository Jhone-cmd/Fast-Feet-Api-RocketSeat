import { type Either, right } from '@/core/function/either'
import type { Order } from '../../enterprise/entities/order'
import type { OrderRepository } from '../repositories/order-repository'

export interface FetchNearbyOrdersUseCaseRequest {
  page: number
  userLatitude: number
  userLongitude: number
}

type FetchNearbyOrdersUseCaseResponse = Either<null, { orders: Order[] }>

export class FetchNearbyOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    page,
    userLatitude,
    userLongitude,
  }: FetchNearbyOrdersUseCaseRequest): Promise<FetchNearbyOrdersUseCaseResponse> {
    const orders = await this.orderRepository.findNearbyOrders({
      page,
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return right({ orders })
  }
}
