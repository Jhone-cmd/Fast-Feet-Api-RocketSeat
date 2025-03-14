import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Order } from '../../enterprise/entities/order'

export interface OrderRepository {
  create(order: Order): Promise<void>
  findManyOrder(params: PaginationParams): Promise<Order[]>
}
