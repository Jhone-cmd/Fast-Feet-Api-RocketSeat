import { faker } from "@faker-js/faker";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";
import { Employee, type EmployeeProps } from "src/domain/fast-feet/enterprise/entities/employee";
import { CPF } from "src/domain/fast-feet/enterprise/entities/value-objects/cpf";
import { generateCPF } from "test/utils/generate-cpf";

export function makeEmployee (
    override: Partial<EmployeeProps> = {},
    id?: UniqueEntityId
) {
    const employee = Employee.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        cpf: new CPF(generateCPF()),
        role: 'admin',    
        ...override     
    }, id)

    return employee
}
    
