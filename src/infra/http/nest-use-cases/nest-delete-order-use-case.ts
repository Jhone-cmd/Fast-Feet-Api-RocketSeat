import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { DeleteOrderUseCase } from '@/domain/fast-feet/application/use-cases/delete-order'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestDeleteOrderUseCase extends DeleteOrderUseCase {
  constructor(
    orderRepository: OrderRepository,
    employeeRepository: EmployeeRepository
  ) {
    super(orderRepository, employeeRepository)
  }
}
