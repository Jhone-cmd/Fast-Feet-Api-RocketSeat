import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { Either, left, right } from '@/core/function/either'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { OrderStatus } from '@/domain/fast-feet/enterprise/entities/types/order-status'
import { OrderAttachmentRepository } from '../repositories/order-attachment-repository'
import { NotDeliveredOrder } from './errors/not-delivered-order'
export interface OnOrderStatusUseCaseRequest {
  orderId: string
  deliveryManId?: string | null
  status: OrderStatus
}

type OnOrderStatusUseCaseResponse = Either<
  ResourceNotFound | NotDeliveredOrder,
  null
>

export class OnOrderStatusUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderAttachmentRepository: OrderAttachmentRepository
  ) {}

  async execute({
    orderId,
    deliveryManId,
    status,
  }: OnOrderStatusUseCaseRequest): Promise<OnOrderStatusUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)
    const attachment =
      await this.orderAttachmentRepository.findByOrderId(orderId)

    if (!order) return left(new ResourceNotFound())

    if (
      !attachment &&
      status === 'delivered' &&
      deliveryManId !== order.deliveryManId?.toString()
    ) {
      return left(new NotDeliveredOrder())
    }

    order.status = status ? status : order.status

    await this.orderRepository.save(order)

    return right(null)
  }
}
