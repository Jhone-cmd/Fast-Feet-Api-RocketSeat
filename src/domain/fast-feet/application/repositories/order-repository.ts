import type { FindNearbyOrdersParams } from '@/core/repositories/find-nearby-orders-params'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Order } from '../../enterprise/entities/order'

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>
  abstract findManyOrder(params: PaginationParams): Promise<Order[]>
  abstract findById(id: string): Promise<Order | null>
  abstract findNearbyOrders(params: FindNearbyOrdersParams): Promise<Order[]>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
