import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    const { name, email, cpf, password } = body

    const AccountSameWithExistEmail = await this.prisma.accounts.findUnique({
      where: {
        email,
      },
    })

    if (AccountSameWithExistEmail) {
      throw new ConflictException('Email already exists')
    }

    const hashPassword = await hash(password, 8)
    await this.prisma.accounts.create({
      data: {
        name,
        email,
        cpf,
        password: hashPassword,
      },
    })
  }
}
