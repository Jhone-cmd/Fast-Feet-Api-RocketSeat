import { RecipientRepository } from '@/domain/fast-feet/application/repositories/recipient-repository'
import { FetchRecipientsUseCase } from '@/domain/fast-feet/application/use-cases/fetch-recipients'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFetchRecipientsUseCase extends FetchRecipientsUseCase {
  constructor(recipientRepository: RecipientRepository) {
    super(recipientRepository)
  }
}
