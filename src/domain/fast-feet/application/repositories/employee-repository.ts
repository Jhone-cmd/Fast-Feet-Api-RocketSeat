import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { Employee } from "../../enterprise/entities/employee";

export interface EmployeeRepository {
    create(employee: Employee): Promise<void>
    findByEmail(email: string): Promise<Employee | null>
    findByCPF(cpf: string): Promise<Employee | null>
    findById(id: string): Promise<Employee | null>
    findManyDeliveryMan(params: PaginationParams): Promise<Employee[]>
    delete(employee: Employee): Promise<void>
}