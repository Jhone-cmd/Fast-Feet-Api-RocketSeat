import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'
import { AccountAlreadyExists } from '@/domain/fast-feet/application/use-cases/errors/account-already-exists'
import { RegisterAccountProperties } from '../api-properties/register-account-properties'
import { NestCreateAccountUseCase } from '../nest-use-cases/nest-create-account-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  cpf: z.string().length(11),
  password: z.string().min(8),
  rule: z.enum(['admin', 'deliveryman']).default('deliveryman'),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@ApiTags('Accounts')
@Controller('/accounts')
export class CreateAccountController {
  constructor(private nestCreateAccount: NestCreateAccountUseCase) {}

  @Post()
  @ApiBody({
    description:
      'Provide account details to create a new user. CPF and email must be unique.',
    type: RegisterAccountProperties,
    examples: {
      deliverymanExample: {
        summary: 'Example for a deliveryman account',
        value: {
          name: 'deliveryman',
          email: 'deliveryman@example.com',
          cpf: '01234567890',
          password: 'deliverymanpassword',
          rule: 'deliveryman',
        },
      },
      adminExample: {
        summary: 'Example for an admin account',
        value: {
          name: 'admin',
          email: 'admin@example.com',
          cpf: '12345678900',
          password: 'adminpassword',
          rule: 'admin',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Account Creation Successful.' })
  @ApiConflictResponse({
    description: 'Conflict when creating a new account.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, cpf, password, rule } = body

    const result = await this.nestCreateAccount.execute({
      name,
      email,
      cpf,
      password,
      rule,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AccountAlreadyExists:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
