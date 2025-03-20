import type { FindNearbyOrdersParams } from '@/core/repositories/find-nearby-orders-params'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Order } from '../../enterprise/entities/order'

export interface OrderRepository {
  create(order: Order): Promise<void>
  findManyOrder(params: PaginationParams): Promise<Order[]>
  findById(id: string): Promise<Order | null>
  findNearbyOrders(params: FindNearbyOrdersParams): Promise<Order[]>
  save(order: Order): Promise<void>
  delete(order: Order): Promise<void>
}
