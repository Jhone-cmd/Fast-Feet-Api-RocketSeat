import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import type { Notification } from '../../enterprise/entities/notification'
import type { NotificationRepository } from '../repositories/notification-repository'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  { notification: Notification }
>

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) return left(new ResourceNotFound())

    if (recipientId !== notification.recipientId.toString())
      return left(new NotAllowed())

    notification.read()
    await this.notificationRepository.save(notification)

    return right({ notification })
  }
}
