import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestReadNotificationUseCase extends ReadNotificationUseCase {
  constructor(notificationRepository: NotificationRepository) {
    super(notificationRepository)
  }
}
