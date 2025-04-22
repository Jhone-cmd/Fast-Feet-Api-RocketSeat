import { PaginationParams } from '@/core/repositories/pagination-params'
import { EmployeeRepository } from '@/domain/fast-feet/application/repositories/employee-repository'
import { Employee } from '@/domain/fast-feet/enterprise/entities/employee'
import { Injectable } from '@nestjs/common'
import { PrismaEmployeeMapper } from '../mappers/prisma-employee-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create(employee: Employee): Promise<void> {
    const data = PrismaEmployeeMapper.toPrisma(employee)
    await this.prisma.accounts.create({
      data,
    })
  }
  async findByEmail(email: string): Promise<Employee | null> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        email,
      },
    })
    if (!account) return null

    return PrismaEmployeeMapper.toDomain(account)
  }

  async findByCPF(cpf: string): Promise<Employee | null> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        cpf,
      },
    })
    if (!account) return null

    return PrismaEmployeeMapper.toDomain(account)
  }

  async findById(id: string): Promise<Employee | null> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        id,
      },
    })
    if (!account) return null

    return PrismaEmployeeMapper.toDomain(account)
  }

  async findManyDeliveryMan({ page }: PaginationParams): Promise<Employee[]> {
    const perPage = 20
    const deliverymans = await this.prisma.accounts.findMany({
      where: {
        role: 'deliveryman',
      },
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return deliverymans.map(PrismaEmployeeMapper.toDomain)
  }

  async permission(id: string): Promise<boolean> {
    const account = await this.prisma.accounts.findUnique({
      where: {
        id,
      },
    })

    if (account?.role === 'admin') {
      return true
    }

    return false
  }

  async delete(employee: Employee): Promise<void> {
    const data = PrismaEmployeeMapper.toPrisma(employee)
    await this.prisma.accounts.delete({
      where: {
        id: data.id,
      },
    })
  }

  async save(employee: Employee): Promise<void> {
    const data = PrismaEmployeeMapper.toPrisma(employee)
    await this.prisma.accounts.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
