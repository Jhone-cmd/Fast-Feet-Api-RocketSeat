import { Order } from '@/domain/fast-feet/enterprise/entities/order'

export class OrderDetailsPresenter {
  static toHttp(order: Order) {
    return {
      id: order.id.toString(),
      name: order.name,
      slug: order.slug.value.toString(),
      status: order.status,
      latitude: order.latitude,
      longitude: order.longitude,
      deliveryman: order.deliverymanId?.toString(),
      recipient: order.recipientId.toString(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
