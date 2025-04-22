import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string().length(11),
  phone: z.string(),
  address: z.string(),
})

const bodyValidationSchema = new ZodValidationPipe(createRecipientBodySchema)

export type CreateRecipientBodySchema = z.infer<
  typeof createRecipientBodySchema
>

@Controller('/accounts/recipients')
export class CreateRecipientController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async handle(@Body(bodyValidationSchema) body: CreateRecipientBodySchema) {
    const { name, cpf, phone, address } = body

    const [account, recipient] = await Promise.all([
      this.prisma.accounts.findUnique({ where: { cpf } }),
      this.prisma.recipients.findUnique({ where: { cpf } }),
    ])

    if (account || recipient) {
      throw new ConflictException('CPF already exists.')
    }

    await this.prisma.recipients.create({
      data: { name, cpf, phone, address },
    })
  }
}
