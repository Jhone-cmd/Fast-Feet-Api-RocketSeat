import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'
import { PrismaEmployeeRepository } from './prisma/repositories/prisma-employee-repository'
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'

@Module({
  providers: [
    PrismaService,
    PrismaEmployeeRepository,
    PrismaRecipientRepository,
    PrismaOrderRepository,
    PrismaAttachmentRepository,
  ],
  exports: [
    PrismaService,
    PrismaEmployeeRepository,
    PrismaRecipientRepository,
    PrismaOrderRepository,
    PrismaAttachmentRepository,
  ],
})
export class DatabaseModule {}
