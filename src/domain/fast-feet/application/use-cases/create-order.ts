import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import { Order } from '../../enterprise/entities/order'
import { OrderStatus } from '../../enterprise/entities/types/order-status'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import { EmployeeRepository } from '../repositories/employee-repository'
import type { OrderRepository } from '../repositories/order-repository'
import type { RecipientRepository } from '../repositories/recipient-repository'

export interface CreateOrderUseCaseRequest {
  adminId: string
  name: string
  status: OrderStatus
  recipientId: string
  latitude: number
  longitude: number
}

type CreateOrderUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  { order: Order }
>

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository,
    private employeeRepository: EmployeeRepository
  ) {}

  async execute({
    adminId,
    name,
    status,
    recipientId,
    latitude,
    longitude,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    if (!employee) return left(new ResourceNotFound())

    const admin = EmployeeRule.isAdmin(employee.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFound())
    }

    const order = Order.create({
      name,
      recipientId: new UniqueEntityId(recipientId),
      status,
      latitude,
      longitude,
    })

    await this.orderRepository.create(order)

    return right({ order })
  }
}
