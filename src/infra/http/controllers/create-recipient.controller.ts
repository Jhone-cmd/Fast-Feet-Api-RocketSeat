import { RecipientAlreadyExists } from '@/domain/fast-feet/application/use-cases/errors/recipient-already-exists'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { NestCreateRecipientUseCase } from '../nest-use-cases/nest-create-recipient-use-case'
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
  constructor(private nestCreateRecipient: NestCreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async handle(@Body(bodyValidationSchema) body: CreateRecipientBodySchema) {
    const { name, cpf, phone, address } = body

    const result = await this.nestCreateRecipient.execute({
      name,
      cpf,
      phone,
      address,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case RecipientAlreadyExists:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
