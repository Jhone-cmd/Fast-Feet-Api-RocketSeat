import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestSendNotificationUseCase extends SendNotificationUseCase {
  constructor(notificationRepository: NotificationRepository) {
    super(notificationRepository)
  }
}
