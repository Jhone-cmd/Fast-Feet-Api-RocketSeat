import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import type { Recipient } from '../../enterprise/entities/recipient'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import { EmployeeRepository } from '../repositories/employee-repository'
import type { RecipientRepository } from '../repositories/recipient-repository'

export interface EditRecipientUseCaseRequest {
  adminId: string
  recipientId: string
  name?: string
  address?: string
  phone?: string
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  { recipient: Recipient }
>

export class EditRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private employeeRepository: EmployeeRepository
  ) {}

  async execute({
    adminId,
    recipientId,
    name,
    address,
    phone,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    const admin = EmployeeRule.isValidRule(employee?.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) return left(new ResourceNotFound())

    recipient.name = name ? name : recipient.name
    recipient.address = address ? address : recipient.address
    recipient.phone = phone ? phone : recipient.phone

    await this.recipientRepository.save(recipient)

    return right({ recipient })
  }
}
