import { HashGenerator } from '@/domain/fast-feet/application/cryptography/hash-generator'
import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { OnchangePasswordUseCase } from '@/domain/fast-feet/application/use-cases/on-change-password'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestOnChangePasswordUseCase extends OnchangePasswordUseCase {
  constructor(
    employeeRepository: EmployeeRepository,
    hashGenerator: HashGenerator
  ) {
    super(employeeRepository, hashGenerator)
  }
}
