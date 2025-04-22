import { PaginationParams } from '@/core/repositories/pagination-params'
import { RecipientRepository } from '@/domain/fast-feet/application/repositories/recipient-repository'
import { Recipient } from '@/domain/fast-feet/enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  create(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findByCPF(cpf: string): Promise<Recipient | null> {
    throw new Error('Method not implemented.')
  }
  findManyRecipient(params: PaginationParams): Promise<Recipient[]> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Recipient | null> {
    throw new Error('Method not implemented.')
  }
  delete(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }
  save(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
