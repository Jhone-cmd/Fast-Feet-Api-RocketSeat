import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import { EmployeeRepository } from '../repositories/employee-repository'
import type { RecipientRepository } from '../repositories/recipient-repository'

export interface DeleteRecipientUseCaseRequest {
  adminId: string
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFound, null>

export class DeleteRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private employeeRepository: EmployeeRepository
  ) {}

  async execute({
    adminId,
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    const admin = EmployeeRule.isValidRule(employee?.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) return left(new ResourceNotFound())

    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
