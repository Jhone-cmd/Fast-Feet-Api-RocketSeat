import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import type { Recipient } from '../../enterprise/entities/recipient'
import type { RecipientRepository } from '../repositories/recipient-repository'

export interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  address: string
  phone: string
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFound,
  { recipient: Recipient }
>

export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
    name,
    address,
    phone,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) return left(new ResourceNotFound())

    recipient.name = name
    recipient.address = address
    recipient.phone = phone

    await this.recipientRepository.save(recipient)

    return right({ recipient })
  }
}
