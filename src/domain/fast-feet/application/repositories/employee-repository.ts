import type { Employee } from "../../enterprise/entities/employee";

export interface EmployeeRepository {
    create(employee: Employee): Promise<void>
}