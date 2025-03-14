import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import type { Order } from '@/domain/fast-feet/enterprise/entities/order'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }

  async findManyOrder({ page }: PaginationParams): Promise<Order[]> {
    const order = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return order
  }
}
