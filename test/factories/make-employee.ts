import { faker } from "@faker-js/faker";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Employee, type EmployeeProps } from "src/domain/fast-feet/enterprise/entities/employee";
import { CPF } from "src/domain/fast-feet/enterprise/entities/value-objects/cpf";

export function makeEmployee (
    override: Partial<EmployeeProps> = {},
    id?: UniqueEntityId
) {
    const employee = Employee.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        cpf: new CPF('12345687910'),
        role: 'admin',    
        ...override     
    }, id)

    return employee
}
    
