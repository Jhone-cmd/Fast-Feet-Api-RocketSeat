import { HashGenerator } from '@/domain/fast-feet/application/cryptography/hash-generator'
import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { EditDeliveryManUseCase } from '@/domain/fast-feet/application/use-cases/edit-deliveryman'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestEditDeliveryManUseCase extends EditDeliveryManUseCase {
  constructor(
    employeeRepository: EmployeeRepository,
    hashGenerator: HashGenerator
  ) {
    super(employeeRepository, hashGenerator)
  }
}
