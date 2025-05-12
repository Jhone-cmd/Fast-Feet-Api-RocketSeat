import { AttachmentRepository } from '@/domain/fast-feet/application/repositories/attachment-repository'
import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { RecipientRepository } from '@/domain/fast-feet/application/repositories/recipient-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'
import { PrismaEmployeeRepository } from './prisma/repositories/prisma-employee-repository'
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: EmployeeRepository,
      useClass: PrismaEmployeeRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },

    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
  ],
  exports: [
    PrismaService,
    EmployeeRepository,
    RecipientRepository,
    OrderRepository,
    AttachmentRepository,
  ],
})
export class DatabaseModule {}
