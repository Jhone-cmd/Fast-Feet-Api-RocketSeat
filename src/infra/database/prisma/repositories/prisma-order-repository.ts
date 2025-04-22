import { FindNearbyOrdersParams } from '@/core/repositories/find-nearby-orders-params'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { Order } from '@/domain/fast-feet/enterprise/entities/order'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  create(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findManyOrder(params: PaginationParams): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.')
  }
  findNearbyOrders(params: FindNearbyOrdersParams): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }
  save(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
  delete(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
