import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import { EmployeeRepository } from '../repositories/employee-repository'
import type { OrderRepository } from '../repositories/order-repository'

export interface EditOrderUseCaseRequest {
  adminId: string
  orderId: string
  deliveryManId?: string
  name?: string
}

type EditOrderUseCaseResponse = Either<ResourceNotFound | NotAllowed, null>

export class EditOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private employeeRepository: EmployeeRepository
  ) {}

  async execute({
    adminId,
    orderId,
    deliveryManId,
    name,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    if (!employee) return left(new ResourceNotFound())

    const admin = EmployeeRule.isAdmin(employee.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) return left(new ResourceNotFound())

    order.name = name ? name : order.name
    order.deliverymanId = deliveryManId
      ? new UniqueEntityId(deliveryManId)
      : order.deliverymanId

    await this.orderRepository.save(order)

    return right(null)
  }
}
