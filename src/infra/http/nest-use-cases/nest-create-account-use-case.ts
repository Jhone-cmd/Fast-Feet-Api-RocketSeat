import { HashGenerator } from '@/domain/fast-feet/application/cryptography/hash-generator'
import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { RegisterEmployeeUseCase } from '@/domain/fast-feet/application/use-cases/register-employee'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestCreateAccountUseCase extends RegisterEmployeeUseCase {
  constructor(
    employeeRepository: EmployeeRepository,
    hashGenerator: HashGenerator
  ) {
    super(employeeRepository, hashGenerator)
  }
}
