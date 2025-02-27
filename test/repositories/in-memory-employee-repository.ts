import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { EmployeeRepository } from 'src/domain/fast-feet/application/repositories/employee-repository'
import type { Employee } from 'src/domain/fast-feet/enterprise/entities/employee'

export class InMemoryEmployeeRepository implements EmployeeRepository {
  public items: Employee[] = []

  async create(employee: Employee): Promise<void> {
    this.items.push(employee)
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const employee = this.items.find(item => item.email === email)

    if (!employee) return null

    return employee
  }

  async findByCPF(cpf: string): Promise<Employee | null> {
    const employee = this.items.find(item => item.cpf.value === cpf)

    if (!employee) return null

    return employee
  }

  async findById(id: string): Promise<Employee | null> {
    const employee = this.items.find(item => item.id.toString() === id)
    if (!employee) return null

    return employee
  }

  async findManyDeliveryMan({ page }: PaginationParams): Promise<Employee[]> {
    const deliveryMan = this.items
      .filter(item => item.role === 'deliveryman')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return deliveryMan
  }

  async permission(id: string): Promise<boolean> {
    const employee = this.items.find(item => item.id.toString() === id)

    if (employee?.role === 'deliveryman') return false

    return true
  }

  async save(employee: Employee): Promise<void> {
    const employeeIndex = this.items.findIndex(item => item.id === employee.id)
    this.items[employeeIndex] = employee
  }

  async delete(employee: Employee): Promise<void> {
    const employeeIndex = this.items.findIndex(item => item.id === employee.id)
    this.items.splice(employeeIndex, 1)
  }
}
