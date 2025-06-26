import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { EditRecipientProperties } from '../api-properties/edit-recipient-properties'
import { NestEditRecipientUseCase } from '../nest-use-cases/nest-edit-recipient-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>
@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/recipients/:recipientId')
export class EditRecipientController {
  constructor(private nestEditRecipient: NestEditRecipientUseCase) {}

  @Put()
  @ApiBody({
    description: 'Provide name, address or phone for updated',
    type: EditRecipientProperties,
    required: false,
  })
  @ApiNoContentResponse({ description: 'Recipient Updated Successfully.' })
  @ApiParam({
    name: 'recipientId',
    description: 'recipientId parameter to check which recipient to update.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to administrator.',
  })
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param('recipientId') recipientId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const { name, address, phone } = body

    const result = await this.nestEditRecipient.execute({
      adminId,
      recipientId,
      name,
      address,
      phone,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFound:
          throw new BadRequestException(error.message)
        case NotAllowed:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
