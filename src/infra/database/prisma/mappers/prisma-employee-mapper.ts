import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Employee } from '@/domain/fast-feet/enterprise/entities/employee'
import { CPF } from '@/domain/fast-feet/enterprise/entities/value-objects/cpf'
import { Prisma, Accounts as PrismaEmployee } from '@prisma/client'

export class PrismaEmployeeMapper {
  static toDomain(raw: PrismaEmployee): Employee {
    return Employee.create(
      {
        name: raw.name,
        email: raw.email,
        cpf: new CPF(raw.cpf),
        password: raw.password,
        role: raw.role,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(account: Employee): Prisma.AccountsUncheckedCreateInput {
    return {
      id: account.id.toString(),
      name: account.name,
      email: account.email,
      cpf: account.cpf.toString(),
      password: account.password,
      role: account.role,
    }
  }
}
