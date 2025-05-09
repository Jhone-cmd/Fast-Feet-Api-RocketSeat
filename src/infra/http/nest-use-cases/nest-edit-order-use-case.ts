import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { EditOrderUseCase } from '@/domain/fast-feet/application/use-cases/edit-order'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestEditOrderUseCase extends EditOrderUseCase {
  constructor(
    orderRepository: OrderRepository,
    employeeRepository: EmployeeRepository
  ) {
    super(orderRepository, employeeRepository)
  }
}
