import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Employee,
  type EmployeeProps,
} from '@/domain/fast-feet/enterprise/entities/employee'
import { CPF } from '@/domain/fast-feet/enterprise/entities/value-objects/cpf'
import { PrismaEmployeeMapper } from '@/infra/database/prisma/mappers/prisma-employee-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class AccountFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaEmployee(
    data: Partial<EmployeeProps> = {}
  ): Promise<Employee> {
    const account = makeEmployee(data)

    await this.prisma.accounts.create({
      data: PrismaEmployeeMapper.toPrisma(account),
    })

    return account
  }
}
