import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  ApiAcceptedResponse,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { PrismaService } from '../../database/prisma/prisma.service'
import { AuthenticateProperties } from '../api-properties/authenticate-properties'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  cpf: z.string().length(11),
  password: z.string().min(8),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('Authenticate')
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  @Post()
  @ApiBody({
    description:
      'Provide the CPF and password to authenticate the account and generate the access token.',
    type: AuthenticateProperties,
    examples: {
      authenticateExample: {
        summary: 'Example for a authenticate account',
        value: {
          cpf: '12345678900',
          password: 'adminpassword',
        },
      },
    },
  })
  @ApiAcceptedResponse({
    description: 'access token.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid Credentials.',
  })
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

    const payload = { sub: account.id, rule: account.rule }

    const accessToken = this.jwt.signAsync(payload)

    return {
      access_token: accessToken,
    }
  }
}
