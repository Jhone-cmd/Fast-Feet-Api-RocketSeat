import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { OrderRepository } from '@/domain/fast-feet/application/repositories/order-repository'
import { RecipientRepository } from '@/domain/fast-feet/application/repositories/recipient-repository'
import { CreateOrderUseCase } from '@/domain/fast-feet/application/use-cases/create-order'
import { Injectable } from '@nestjs/common'

@Injectable()
export class NestCreateOrderUseCase extends CreateOrderUseCase {
  constructor(
    orderRepository: OrderRepository,
    recipientRepository: RecipientRepository,
    employeeRepository: EmployeeRepository
  ) {
    super(orderRepository, recipientRepository, employeeRepository)
  }
}
