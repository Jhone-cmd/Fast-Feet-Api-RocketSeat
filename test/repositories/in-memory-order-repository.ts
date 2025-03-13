import type { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import type { Order } from '@/domain/fast-feet/enterprise/entities/order'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async create(order: Order): Promise<void> {
    this.items.push(order)
  }
}
