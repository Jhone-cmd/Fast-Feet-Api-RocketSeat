import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { type Either, left, right } from '@/core/function/either'
import type { Employee } from '../../enterprise/entities/employee'
import type { HashGenerator } from '../cryptography/hash-generator'
import type { EmployeeRepository } from '../repositories/employee-repository'

export interface EditDeliveryManUseCaseRequest {
  adminId: string
  deliveryManId: string
  password: string
}

type EditDeliveryManUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  { deliveryMan: Employee }
>

export class EditDeliveryManUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    adminId,
    deliveryManId,
    password,
  }: EditDeliveryManUseCaseRequest): Promise<EditDeliveryManUseCaseResponse> {
    const admin = await this.employeeRepository.permission(adminId)

    if (!admin) return left(new NotAllowed())

    const deliveryMan = await this.employeeRepository.findById(deliveryManId)

    if (!deliveryMan) return left(new ResourceNotFound())

    const newPassword = await this.hashGenerator.hash(password)

    deliveryMan.password = newPassword

    await this.employeeRepository.save(deliveryMan)

    return right({ deliveryMan })
  }
}
