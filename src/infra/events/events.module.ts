import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { NestOnOrderChangeStatus } from './nest-subscribers/nest-on-order-change-status'
import { NestSendNotificationUseCase } from './nest-use-cases/nest-send-notification-use-case'

@Module({
  imports: [DatabaseModule],
  providers: [NestSendNotificationUseCase, NestOnOrderChangeStatus],
})
export class EventsModule {}
