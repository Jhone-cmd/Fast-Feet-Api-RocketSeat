import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { Either, left, right } from '@/core/function/either'
import { Rule } from '../../enterprise/entities/types/rule'
import { EmployeeRule } from '../../enterprise/entities/value-objects/employee-rule'
import { HashGenerator } from '../cryptography/hash-generator'
import { EmployeeRepository } from '../repositories/employee-repository'

export interface OnchangePasswordUseCaseRequest {
  adminId: string
  deliveryManId: string
  password: string
}

type OnchangePasswordUseCaseResponse = Either<
  ResourceNotFound | NotAllowed,
  null
>
export class OnchangePasswordUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    adminId,
    deliveryManId,
    password,
  }: OnchangePasswordUseCaseRequest): Promise<OnchangePasswordUseCaseResponse> {
    const employee = await this.employeeRepository.findById(adminId)

    if (!employee) return left(new ResourceNotFound())

    const admin = EmployeeRule.isAdmin(employee.rule as Rule)

    if (!admin) return left(new NotAllowed())

    const deliveryMan = await this.employeeRepository.findById(deliveryManId)

    if (!deliveryMan) return left(new ResourceNotFound())

    deliveryMan.password = await this.hashGenerator.hash(password)

    await this.employeeRepository.save(deliveryMan)

    return right(null)
  }
}
