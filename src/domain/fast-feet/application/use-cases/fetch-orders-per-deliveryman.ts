import { type Either, right } from '@/core/function/either'
import type { Order } from '../../enterprise/entities/order'
import type { OrderRepository } from '../repositories/order-repository'

export interface FetchOrdersPerDeliveryManUseCaseRequest {
  deliveryManId: string
  page: number
}

type FetchOrdersPerDeliveryManUseCaseResponse = Either<
  null,
  { orders: Order[] }
>

export class FetchOrdersPerDeliveryManUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliveryManId,
    page,
  }: FetchOrdersPerDeliveryManUseCaseRequest): Promise<FetchOrdersPerDeliveryManUseCaseResponse> {
    const orders = await this.orderRepository.findManyOrderPerDeliveryMan(
      deliveryManId,
      {
        page,
      }
    )

    return right({ orders })
  }
}
