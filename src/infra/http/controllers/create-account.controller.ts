import { AccountAlreadyExists } from '@/domain/fast-feet/application/use-cases/errors/account-already-exists'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { NestCreateAccountUseCase } from '../nest-use-cases/nest-create-account-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string().length(11),
  password: z.string(),
  role: z.enum(['admin', 'deliveryman']).default('deliveryman'),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private nestCreateAccount: NestCreateAccountUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, cpf, password, role } = body

    const result = await this.nestCreateAccount.execute({
      name,
      email,
      cpf,
      password,
      role,
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
