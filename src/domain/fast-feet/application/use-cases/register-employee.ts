import { type Either, left, right } from '@/core/function/either'
import { Employee } from '../../enterprise/entities/employee'
import type { Role } from '../../enterprise/entities/types/role'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import type { HashGenerator } from '../cryptography/hash-generator'
import type { EmployeeRepository } from '../repositories/employee-repository'
import { InvalidCPF } from './errors/invalid-cpf'
import { UserAlreadyExists } from './errors/user-already-exists'
import { WrongJOB } from './errors/wrong-job'

export interface EmployeeRequest {
  name: string
  email: string
  cpf: string
  password: string
  role: string
}

type EmployeeResponse = Either<UserAlreadyExists, { employee: Employee }>
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
    role,
  }: EmployeeRequest): Promise<EmployeeResponse> {
    const employeeWithSameEmail =
      await this.employeeRepository.findByEmail(email)

    if (employeeWithSameEmail) {
      return left(new UserAlreadyExists(email))
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
      return left(new UserAlreadyExists(cpfFormatted.value))
    }

    const isValidResponsibility = Employee.isValidRole(role)

    if (!isValidResponsibility) {
      return left(new WrongJOB(role))
    }

    const passwordHash = await this.hashGenerator.hash(password)

    const employee = Employee.create({
      name,
      email,
      cpf: cpfFormatted,
      password: passwordHash,
      role: role as Role,
    })

    await this.employeeRepository.create(employee)

    return right({ employee })
  }
}
