import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import type { EmployeeRepository } from '../repositories/employee-repository'

export interface DeleteDeliveryManUseCaseRequest {
  adminId: string
  deliveryManId: string
}

type DeleteDeliveryManUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  null
>

export class DeleteDeliveryManUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute({
    adminId,
    deliveryManId,
  }: DeleteDeliveryManUseCaseRequest): Promise<DeleteDeliveryManUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    if (!employee) return left(new ResourceNotFound())

    const admin = EmployeeRule.isAdmin(employee.rule as Rule)

    if (!admin) {
      return left(new NotAllowed())
    }

    const deliveryMan = await this.employeeRepository.findById(deliveryManId)

    if (!deliveryMan) return left(new ResourceNotFound())

    await this.employeeRepository.delete(deliveryMan)

    return right(null)
  }
}
