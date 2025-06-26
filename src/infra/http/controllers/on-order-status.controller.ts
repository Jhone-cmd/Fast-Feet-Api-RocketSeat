import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { NotDeliveredOrder } from '@/domain/fast-feet/application/use-cases/errors/not-delivered-order'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
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
@Controller('/orders/:orderId/status')
export class OnOrderStatusController {
  constructor(private nestOnOrderStatus: NestOnOrderStatusUseCase) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: OnOrderStatusBodySchema,
    @Param('orderId') orderId: string
  ) {
    const { status } = body

    const result = await this.nestOnOrderStatus.execute({
      orderId,
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
