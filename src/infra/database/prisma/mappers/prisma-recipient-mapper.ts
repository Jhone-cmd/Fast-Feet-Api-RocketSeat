import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/fast-feet/enterprise/entities/recipient'
import { CPF } from '@/domain/fast-feet/enterprise/entities/value-objects/cpf'
import { Prisma, Recipients as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        cpf: new CPF(raw.cpf),
        phone: raw.phone,
        address: raw.address,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientsUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.value.toString(),
      phone: recipient.phone,
      address: recipient.address,
    }
  }
}
