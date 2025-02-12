import type { Employee } from "../../enterprise/entities/employee";

export interface EmployeeRepository {
    create(employee: Employee): Promise<void>
    findByEmail(email: string): Promise<Employee | null>
    findByCPF(cpf: string): Promise<Employee | null>
}