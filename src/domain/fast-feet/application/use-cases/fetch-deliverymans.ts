import { type Either, right } from '@/core/function/either'
import type { Employee } from '../../enterprise/entities/employee'
import type { EmployeeRepository } from '../repositories/employee-repository'

export interface FetchDeliveryMansUseCaseRequest {
  page: number
}

type FetchDeliveryMansUseCaseResponse = Either<
  null,
  {
    deliveryMan: Employee[]
  }
>

export class FetchDeliveryMansUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute({
    page,
  }: FetchDeliveryMansUseCaseRequest): Promise<FetchDeliveryMansUseCaseResponse> {
    const deliveryMan = await this.employeeRepository.findManyDeliveryMan({
      page,
    })
    return right({ deliveryMan })
  }
}
