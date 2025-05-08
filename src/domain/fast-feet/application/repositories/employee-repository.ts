import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Employee } from '../../enterprise/entities/employee'

export abstract class EmployeeRepository {
  abstract create(employee: Employee): Promise<void>
  abstract findByEmail(email: string): Promise<Employee | null>
  abstract findByCPF(cpf: string): Promise<Employee | null>
  abstract findById(id: string): Promise<Employee | null>
  abstract findManyDeliveryMan(params: PaginationParams): Promise<Employee[]>
  abstract delete(employee: Employee): Promise<void>
  abstract save(employee: Employee): Promise<void>
}
