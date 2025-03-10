import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Recipient } from '../../enterprise/entities/recipient'

export interface RecipientRepository {
  create(recipient: Recipient): Promise<void>
  findByCPF(cpf: string): Promise<Recipient | null>
  findManyRecipient(params: PaginationParams): Promise<Recipient[]>
  findById(id: string): Promise<Recipient | null>
  delete(recipient: Recipient): Promise<void>
  save(recipient: Recipient): Promise<void>
}
