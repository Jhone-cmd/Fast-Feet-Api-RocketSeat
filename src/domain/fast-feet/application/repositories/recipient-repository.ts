import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>
  abstract findByCPF(cpf: string): Promise<Recipient | null>
  abstract findManyRecipient(params: PaginationParams): Promise<Recipient[]>
  abstract findById(id: string): Promise<Recipient | null>
  abstract delete(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
}
