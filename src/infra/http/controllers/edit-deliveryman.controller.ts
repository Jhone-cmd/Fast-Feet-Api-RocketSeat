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
import { EditAccountProperties } from '../api-properties/edit-account-properties'
import { NestEditDeliveryManUseCase } from '../nest-use-cases/nest-edit-deliveryman-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editDeliveryManBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliveryManBodySchema)

type EditDeliveryManBodySchema = z.infer<typeof editDeliveryManBodySchema>

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('/accounts/:deliveryManId')
export class EditDeliveryManController {
  constructor(private nestEditDeliveryMan: NestEditDeliveryManUseCase) {}

  @Put()
  @ApiBody({
    description: 'Provide name or email for updated',
    type: EditAccountProperties,
    required: false,
  })
  @ApiNoContentResponse({ description: 'Account Updated Successfully.' })
  @ApiParam({
    name: 'deliveryManId',
    description: 'DeliverymanId parameter to check which account to update.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to administrator.',
  })
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryManBodySchema,
    @Param('deliveryManId') deliveryManId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const { name, email } = body

    const result = await this.nestEditDeliveryMan.execute({
      adminId,
      deliveryManId,
      name,
      email,
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
