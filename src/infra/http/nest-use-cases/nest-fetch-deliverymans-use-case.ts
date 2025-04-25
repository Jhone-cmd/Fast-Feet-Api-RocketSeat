import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { FetchDeliveryMansUseCase } from '@/domain/fast-feet/application/use-cases/fetch-deliverymans'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestFetchDeliverymansUseCase extends FetchDeliveryMansUseCase {
  constructor(employeeRepository: EmployeeRepository) {
    super(employeeRepository)
  }
}
