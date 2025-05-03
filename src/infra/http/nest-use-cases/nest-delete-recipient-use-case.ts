import { RecipientRepository } from '@/domain/fast-feet/application/repositories/recipient-repository'
import { DeleteRecipientUseCase } from '@/domain/fast-feet/application/use-cases/delete-recipient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestDeleteRecipientUseCase extends DeleteRecipientUseCase {
  constructor(recipientRepository: RecipientRepository) {
    super(recipientRepository)
  }
}
