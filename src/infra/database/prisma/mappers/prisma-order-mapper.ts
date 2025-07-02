import { Prisma, Orders as PrismaOrder } from '@prisma/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/fast-feet/enterprise/entities/order'
import { Slug } from '@/domain/fast-feet/enterprise/entities/value-objects/slug'

export interface PrismaOrderDetails extends PrismaOrder {
  deliveryman: {
    name: string
  } | null
  recipient: {
    name: string
  }
}
export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrderDetails): Order {
    return Order.create(
      {
        name: raw.name,
        slug: Slug.create(raw.slug),
        recipientId: new UniqueEntityId(raw.recipientId),
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityId(raw.deliverymanId)
          : null,
        deliverymanName: raw.deliveryman ? raw.deliveryman.name : null,
        recipientName: raw.recipient.name,
        status: raw.status,
        latitude: raw.latitude.toNumber(),
        longitude: raw.longitude.toNumber(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(order: Order): Prisma.OrdersUncheckedCreateInput {
    return {
      id: order.id.toString(),
      name: order.name,
      slug: order.slug.value.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
      status: order.status,
      latitude: order.latitude,
      longitude: order.longitude,
    }
  }
}
