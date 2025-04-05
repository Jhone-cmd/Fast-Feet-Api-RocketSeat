import { DomainEvents } from '@/core/events/domain-events'
import type { FindNearbyOrdersParams } from '@/core/repositories/find-nearby-orders-params'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import type { Order } from '@/domain/fast-feet/enterprise/entities/order'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordenates'

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

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find(item => item.id.toString() === id)

    if (!order) return null

    return order
  }

  async findNearbyOrders({
    page,
    latitude,
    longitude,
  }: FindNearbyOrdersParams): Promise<Order[]> {
    const orders = this.items
      .filter(item => {
        const distance = getDistanceBetweenCoordinates(
          {
            latitude: latitude,
            longitude: longitude,
          },
          {
            latitude: item.latitude,
            longitude: item.longitude,
          }
        )

        return distance < 10
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return orders
  }

  async save(order: Order): Promise<void> {
    const orderIndex = this.items.findIndex(item => item.id === order.id)
    this.items[orderIndex] = order
    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    const orderIndex = this.items.findIndex(item => item.id === order.id)
    this.items.splice(orderIndex, 1)
  }
}
