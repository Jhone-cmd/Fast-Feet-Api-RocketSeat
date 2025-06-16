import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId
) {
  const notification = Notification.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.sentence(),
      recipientId: new UniqueEntityId(),
      ...override,
    },
    id
  )

  return notification
}

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {}
  ): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notifications.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    })

    return notification
  }
}
