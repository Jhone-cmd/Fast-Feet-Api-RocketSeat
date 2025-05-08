import { NotAllowed } from '@/core/errors/error/not-allowed'
import { type Either, left, right } from '@/core/function/either'
import { Recipient } from '../../enterprise/entities/recipient'
import { Rule } from '../../enterprise/entities/types/rule'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import { EmployeeRepository } from '../repositories/employee-repository'
import type { RecipientRepository } from '../repositories/recipient-repository'
import { InvalidCPF } from './errors/invalid-cpf'
import { RecipientAlreadyExists } from './errors/recipient-already-exists'

export interface CreateRecipientUseCaseRequest {
  adminId: string
  name: string
  address: string
  phone: string
  cpf: string
}

type CreateRecipientUseCaseResponse = Either<
  RecipientAlreadyExists | NotAllowed,
  { recipient: Recipient }
>

export class CreateRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private employeeRepository: EmployeeRepository
  ) {}

  async execute({
    adminId,
    name,
    address,
    phone,
    cpf,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    const admin = EmployeeRule.isValidRule(employee?.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const cpfFormatted = new CPF(cpf)
    const isValidCPF = CPF.isValid(cpfFormatted.value)

    if (!isValidCPF) {
      return left(new InvalidCPF(cpfFormatted.value))
    }

    const employeeWithSameCPF = await this.employeeRepository.findByCPF(
      cpfFormatted.value
    )

    const recipientWithSameCPF = await this.recipientRepository.findByCPF(
      cpfFormatted.value
    )

    if (recipientWithSameCPF || employeeWithSameCPF) {
      return left(new RecipientAlreadyExists(cpfFormatted.value))
    }

    const recipient = Recipient.create({
      name,
      address,
      phone,
      cpf: cpfFormatted,
    })

    await this.recipientRepository.create(recipient)

    return right({ recipient })
  }
}
