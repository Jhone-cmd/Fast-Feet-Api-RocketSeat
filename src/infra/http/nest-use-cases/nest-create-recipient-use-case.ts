import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { RecipientRepository } from '@/domain/fast-feet/application/repositories/recipient-repository'
import { CreateRecipientUseCase } from '@/domain/fast-feet/application/use-cases/create-recipient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestCreateRecipientUseCase extends CreateRecipientUseCase {
  constructor(
    recipientRepository: RecipientRepository,
    employeeRepository: EmployeeRepository
  ) {
    super(recipientRepository, employeeRepository)
  }
}
