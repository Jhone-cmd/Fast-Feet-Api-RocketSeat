import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { DeleteDeliveryManUseCase } from '@/domain/fast-feet/application/use-cases/delete-deliveryman'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestDeleteDeliveryManUseCase extends DeleteDeliveryManUseCase {
  constructor(employeeRepository: EmployeeRepository) {
    super(employeeRepository)
  }
}
