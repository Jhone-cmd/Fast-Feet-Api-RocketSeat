import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Employee,
  type EmployeeProps,
} from '@/domain/fast-feet/enterprise/entities/employee'
import { CPF } from '@/domain/fast-feet/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'
import { generateCPF } from 'test/utils/generate-cpf'

export function makeEmployee(
  override: Partial<EmployeeProps> = {},
  id?: UniqueEntityId
) {
  const employee = Employee.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      cpf: new CPF(generateCPF()),
      role: 'admin',
      ...override,
    },
    id
  )

  return employee
}
