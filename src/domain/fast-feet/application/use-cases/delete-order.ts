import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import { EmployeeRepository } from '../repositories/employee-repository'
import type { OrderRepository } from '../repositories/order-repository'

export interface DeleteOrderUseCaseRequest {
  adminId: string
  orderId: string
}

type DeleteOrderUseCaseResponse = Either<ResourceNotFound | NotAllowed, null>

export class DeleteOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private employeeRepository: EmployeeRepository
  ) {}

  async execute({
    adminId,
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    const admin = EmployeeRule.isValidRule(employee?.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) return left(new ResourceNotFound())

    await this.orderRepository.delete(order)

    return right(null)
  }
}
