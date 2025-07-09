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
import { EditOrderProperties } from '../api-properties/edit-order-properties'
import { NestEditOrderUseCase } from '../nest-use-cases/nest-edit-order-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editOrderBodySchema = z.object({
  deliveryManId: z.string().uuid().optional(),
  name: z.string().min(3).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>
@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId')
export class EditOrderController {
  constructor(private nestEditOrder: NestEditOrderUseCase) {}

  @Put()
  @ApiBody({
    description: 'Provide name or deliveryman for updated',
    type: EditOrderProperties,
    required: false,
  })
  @ApiNoContentResponse({ description: 'Order Updated Successfully.' })
  @ApiParam({
    name: 'orderId',
    description: 'orderId parameter to check which order to update.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to administrator.',
  })
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param('orderId') orderId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const { sub: adminId, rule } = account
    if (rule !== 'admin') {
      throw new UnauthorizedException(
        'Unauthorized. Access restricted to administrator.'
      )
    }

    const { name, deliveryManId } = body

    const result = await this.nestEditOrder.execute({
      adminId,
      orderId,
      deliveryManId,
      name,
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
