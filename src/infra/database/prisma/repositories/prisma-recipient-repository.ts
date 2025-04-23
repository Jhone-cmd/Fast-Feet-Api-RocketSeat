import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientRepository } from '@/domain/fast-feet/application/repositories/recipient-repository'
import { Recipient } from '@/domain/fast-feet/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await this.prisma.recipients.create({
      data,
    })
  }

  async findByCPF(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipients.findUnique({
      where: {
        cpf,
      },
    })

    if (!recipient) return null

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findManyRecipient({ page }: PaginationParams): Promise<Recipient[]> {
    const perPage = 20
    const recipients = await this.prisma.recipients.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return recipients.map(PrismaRecipientMapper.toDomain)
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipients.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) return null

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await this.prisma.recipients.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await this.prisma.recipients.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
