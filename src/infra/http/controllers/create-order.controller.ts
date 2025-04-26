import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { NestCreateOrderUseCase } from '../nest-use-cases/nest-create-order-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createOrderBodySchema = z.object({
  name: z.string(),
  status: z
    .enum(['waiting', 'withdrawal', 'returned', 'delivered'])
    .default('waiting'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
})

const bodyValidationSchema = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>
@Controller('/recipients/:recipientId/orders')
export class CreateOrderController {
  constructor(private nestCreateOrder: NestCreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationSchema) body: CreateOrderBodySchema,
    @Param('recipientId') recipientId: string
  ) {
    const { name, status, latitude, longitude } = body

    const result = await this.nestCreateOrder.execute({
      name,
      status,
      latitude,
      longitude,
      recipientId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFound:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
