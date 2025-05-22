import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Prisma, Notifications as PrismaNotifications } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotifications): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    notification: Notification
  ): Prisma.NotificationsUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      recipientId: notification.recipientId.toString(),
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
