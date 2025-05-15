import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import type { Employee } from '../../enterprise/entities/employee'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import type { EmployeeRepository } from '../repositories/employee-repository'

export interface EditDeliveryManUseCaseRequest {
  adminId: string
  deliveryManId: string
  name?: string
  email?: string
}

type EditDeliveryManUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  { deliveryMan: Employee }
>

export class EditDeliveryManUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute({
    adminId,
    deliveryManId,
    name,
    email,
  }: EditDeliveryManUseCaseRequest): Promise<EditDeliveryManUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    if (!employee) return left(new ResourceNotFound())

    const admin = EmployeeRule.isAdmin(employee.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const deliveryMan = await this.employeeRepository.findById(deliveryManId)

    if (!deliveryMan) return left(new ResourceNotFound())

    deliveryMan.name = name ? name : deliveryMan.name
    deliveryMan.email = email ? email : deliveryMan.email

    await this.employeeRepository.save(deliveryMan)

    return right({ deliveryMan })
  }
}
