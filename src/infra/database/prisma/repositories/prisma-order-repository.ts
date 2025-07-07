import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { FindNearbyOrdersParams } from '@/core/repositories/find-nearby-orders-params'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { Order } from '@/domain/fast-feet/enterprise/entities/order'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)
    await this.prisma.orders.create({
      data,
    })
  }

  async findManyOrder({ page }: PaginationParams): Promise<Order[]> {
    const perPage = 20
    const orders = await this.prisma.orders.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        deliveryman: {
          select: {
            name: true,
          },
        },
        recipient: {
          select: {
            name: true,
          },
        },
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.orders.findUnique({
      where: {
        id,
      },
      include: {
        deliveryman: {
          select: {
            name: true,
          },
        },
        recipient: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!order) return null

    return PrismaOrderMapper.toDomain(order)
  }

  async findNearbyOrders({
    page,
    latitude,
    longitude,
  }: FindNearbyOrdersParams): Promise<Order[]> {
    const perPage = 20
    const orders = await this.prisma.orders.findMany({
      where: {
        AND: [
          {
            latitude: {
              gte: latitude - 10 / 111.32,
              lte: latitude + 10 / 111.32,
            },
          },
          {
            longitude: {
              gte:
                longitude -
                10 / (111.32 * Math.cos((latitude * Math.PI) / 180)),
              lte:
                longitude +
                10 / (111.32 * Math.cos((latitude * Math.PI) / 180)),
            },
          },
        ],
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        deliveryman: {
          select: {
            name: true,
          },
        },
        recipient: {
          select: {
            name: true,
          },
        },
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyOrderPerDeliveryMan(
    deliveryManId: string,
    { page }: PaginationParams
  ): Promise<Order[]> {
    const perPage = 20
    const orders = await this.prisma.orders.findMany({
      where: {
        deliverymanId: deliveryManId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        deliveryman: {
          select: {
            name: true,
          },
        },
        recipient: {
          select: {
            name: true,
          },
        },
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)
    await this.prisma.orders.update({
      where: {
        id: data.id,
      },
      data,
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)
    await this.prisma.orders.delete({
      where: {
        id: data.id,
      },
    })
  }
}
