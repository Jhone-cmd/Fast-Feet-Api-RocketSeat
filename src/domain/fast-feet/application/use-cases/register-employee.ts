import { type Either, left, right } from '@/core/function/either'
import { Employee } from '../../enterprise/entities/employee'
import type { Rule } from '../../enterprise/entities/types/rule'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import type { HashGenerator } from '../cryptography/hash-generator'
import type { EmployeeRepository } from '../repositories/employee-repository'
import { AccountAlreadyExists } from './errors/account-already-exists'
import { InvalidCPF } from './errors/invalid-cpf'
import { WrongJOB } from './errors/wrong-job'

export interface EmployeeRequest {
  name: string
  email: string
  cpf: string
  password: string
  rule: string
}

type EmployeeResponse = Either<AccountAlreadyExists, { employee: Employee }>
export class RegisterEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    cpf,
    password,
    rule,
  }: EmployeeRequest): Promise<EmployeeResponse> {
    const employeeWithSameEmail =
      await this.employeeRepository.findByEmail(email)

    if (employeeWithSameEmail) {
      return left(new AccountAlreadyExists(email))
    }

    const cpfFormatted = new CPF(cpf)
    const isValidCPF = CPF.isValid(cpfFormatted.value)

    if (!isValidCPF) {
      return left(new InvalidCPF(cpfFormatted.value))
    }

    const employeeWithSameCPF = await this.employeeRepository.findByCPF(
      cpfFormatted.value
    )

    if (employeeWithSameCPF) {
      return left(new AccountAlreadyExists(cpfFormatted.value))
    }

    const isValidResponsibility = EmployeeRule.isValidRule(rule)

    if (!isValidResponsibility) {
      return left(new WrongJOB(rule))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const employee = Employee.create({
      name,
      email,
      cpf: cpfFormatted,
      password: passwordHash,
      rule: rule as Rule,
    })

    await this.employeeRepository.create(employee)

    return right({ employee })
  }
}
