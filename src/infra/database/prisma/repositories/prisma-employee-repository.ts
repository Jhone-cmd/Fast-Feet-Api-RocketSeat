import { PaginationParams } from '@/core/repositories/pagination-params'
import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { Employee } from '@/domain/fast-feet/enterprise/entities/employee'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  create(employee: Employee): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findByEmail(email: string): Promise<Employee | null> {
    throw new Error('Method not implemented.')
  }
  findByCPF(cpf: string): Promise<Employee | null> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Employee | null> {
    throw new Error('Method not implemented.')
  }
  findManyDeliveryMan(params: PaginationParams): Promise<Employee[]> {
    throw new Error('Method not implemented.')
  }
  permission(id: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
  delete(employee: Employee): Promise<void> {
    throw new Error('Method not implemented.')
  }
  save(employee: Employee): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
