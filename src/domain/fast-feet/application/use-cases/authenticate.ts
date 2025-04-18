import { type Either, left, right } from '@/core/function/either'
import type { Encrypter } from '../cryptography/encrypter'
import type { HashComparer } from '../cryptography/hash-comparer'
import type { EmployeeRepository } from '../repositories/employee-repository'
import { InvalidCredentials } from './errors/invalid-credentials'

export interface AuthenticateUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  InvalidCredentials,
  { accessToken: string }
>

export class AuthenticateUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({ cpf, password }: AuthenticateUseCaseRequest) {
    const employee = await this.employeeRepository.findByCPF(cpf)

    if (!employee) {
      return left(new InvalidCredentials())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      employee.password
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentials())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: employee.id.toString(),
    })

    return right({ accessToken })
  }
}
