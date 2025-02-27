import { type Either, right } from '@/core/function/either'
import type { Recipient } from '../../enterprise/entities/recipient'
import type { RecipientRepository } from '../repositories/recipient-repository'

export interface FetchRecipientUseCaseRequest {
  page: number
}

type FetchRecipientUseCaseResponse = Either<null, { recipient: Recipient[] }>

export class FetchRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    page,
  }: FetchRecipientUseCaseRequest): Promise<FetchRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findManyRecipient({
      page,
    })

    return right({ recipient })
  }
}
