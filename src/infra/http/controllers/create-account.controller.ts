import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { PrismaService } from '../../prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string().length(11),
  password: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
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
