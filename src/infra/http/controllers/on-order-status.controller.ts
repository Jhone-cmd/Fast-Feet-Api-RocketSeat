import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
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
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { AccountAlreadyExists } from '@/domain/fast-feet/application/use-cases/errors/account-already-exists'
import { NotDeliveredOrder } from '@/domain/fast-feet/application/use-cases/errors/not-delivered-order'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ChangeStatusOrderProperties } from '../api-properties/change-status-order-properties'
import { NestOnOrderStatusUseCase } from '../nest-use-cases/nest-on-order-status-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const onOrderStatusBodySchema = z.object({
  status: z
    .enum(['waiting', 'withdrawal', 'returned', 'delivered'])
    .default('waiting'),
})

const bodyValidationPipe = new ZodValidationPipe(onOrderStatusBodySchema)

type OnOrderStatusBodySchema = z.infer<typeof onOrderStatusBodySchema>
@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId/status')
export class OnOrderStatusController {
  constructor(private nestOnOrderStatus: NestOnOrderStatusUseCase) {}

  @Patch()
  @ApiBody({
    description: 'Provide new status of order for updated',
    type: ChangeStatusOrderProperties,
  })
  @ApiNoContentResponse({
    description: 'Changed Status Order Successfully.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'orderId parameter to check which order to change status.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted.',
  })
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: OnOrderStatusBodySchema,
    @Param('orderId') orderId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const { sub: deliveryManId } = account
    const { status } = body

    const result = await this.nestOnOrderStatus.execute({
      orderId,
      deliveryManId,
      status,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFound:
          throw new BadRequestException(error.message)
        case NotDeliveredOrder:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
