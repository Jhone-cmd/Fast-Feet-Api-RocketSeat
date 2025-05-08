import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import type { OrderStatus } from '../../enterprise/entities/types/order-status'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import { EmployeeRepository } from '../repositories/employee-repository'
import type { OrderRepository } from '../repositories/order-repository'

export interface EditOrderUseCaseRequest {
  adminId: string
  orderId: string
  deliveryManId?: string
  name?: string
  status?: OrderStatus
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
    status,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    const admin = EmployeeRule.isValidRule(employee?.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) return left(new ResourceNotFound())

    order.name = name ? name : order.name
    order.status = status ? status : order.status
    order.deliverymanId = deliveryManId
      ? new UniqueEntityId(deliveryManId)
      : order.deliverymanId

    await this.orderRepository.save(order)

    return right(null)
  }
}
