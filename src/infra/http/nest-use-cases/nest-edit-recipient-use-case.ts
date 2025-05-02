import { RecipientRepository } from '@/domain/fast-feet/application/repositories/recipient-repository'
import { EditRecipientUseCase } from '@/domain/fast-feet/application/use-cases/edit-recipient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestEditRecipientUseCase extends EditRecipientUseCase {
  constructor(recipientRepository: RecipientRepository) {
    super(recipientRepository)
  }
}
