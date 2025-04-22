import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  cpf: z.string().length(11),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const account = await this.prisma.accounts.findUnique({
      where: { cpf },
    })

    if (!account) {
      throw new UnauthorizedException('Account credentials do not match.')
    }

    const isPasswordValid = await compare(password, account.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Account credentials do not match.')
    }

    const accessToken = this.jwt.sign({ sub: account.id })

    return {
      access_token: accessToken,
    }
  }
}
