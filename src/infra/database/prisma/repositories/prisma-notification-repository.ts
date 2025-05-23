import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Injectable } from '@nestjs/common'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notifications.create({
      data,
    })
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notifications.findUnique({
      where: {
        id,
      },
    })

    if (!notification) return null

    return PrismaNotificationMapper.toDomain(notification)
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notifications.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
