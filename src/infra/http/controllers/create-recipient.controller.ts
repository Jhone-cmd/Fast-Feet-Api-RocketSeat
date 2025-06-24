import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { RecipientAlreadyExists } from '@/domain/fast-feet/application/use-cases/errors/recipient-already-exists'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { CreateRecipientProperties } from '../api-properties/create-recipient-properties'
import { NestCreateRecipientUseCase } from '../nest-use-cases/nest-create-recipient-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createRecipientBodySchema = z.object({
  name: z.string().min(3),
  cpf: z.string().length(11),
  phone: z.string().min(9),
  address: z.string().min(3),
})

const bodyValidationSchema = new ZodValidationPipe(createRecipientBodySchema)

export type CreateRecipientBodySchema = z.infer<
  typeof createRecipientBodySchema
>
@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/accounts/recipients')
export class CreateRecipientController {
  constructor(private nestCreateRecipient: NestCreateRecipientUseCase) {}

  @Post()
  @ApiBody({
    description:
      'Provide recipient details to create a new user. CPF must be unique.',
    type: CreateRecipientProperties,
    examples: {
      recipientExample: {
        summary: 'Example for a recipient',
        value: {
          name: 'recipient',
          cpf: '09876543210',
          phone: '6693333-7777',
          address: 'Street Right',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Recipient Creation Successful.' })
  @ApiConflictResponse({
    description: 'Conflict when creating a new recipient.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationSchema) body: CreateRecipientBodySchema,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const { name, cpf, phone, address } = body

    const result = await this.nestCreateRecipient.execute({
      adminId,
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
        case NotAllowed:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
