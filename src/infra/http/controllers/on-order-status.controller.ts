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
import { NotDeliveredOrder } from '@/domain/fast-feet/application/use-cases/errors/not-delivered-order'
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
@Controller('/accounts/:deliveryManId/orders/:orderId/status')
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
    name: 'deliveryManId',
    description:
      'deliveryManId parameter to check which order to change status.',
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
    @Param('deliveryManId') deliveryManId: string,
    @Param('orderId') orderId: string
  ) {
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
