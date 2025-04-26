import { type Either, right } from '@/core/function/either'
import type { Recipient } from '../../enterprise/entities/recipient'
import type { RecipientRepository } from '../repositories/recipient-repository'

export interface FetchRecipientsUseCaseRequest {
  page: number
}

type FetchRecipientsUseCaseResponse = Either<null, { recipients: Recipient[] }>

export class FetchRecipientsUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    page,
  }: FetchRecipientsUseCaseRequest): Promise<FetchRecipientsUseCaseResponse> {
    const recipients = await this.recipientRepository.findManyRecipient({
      page,
    })

    return right({ recipients })
  }
}
