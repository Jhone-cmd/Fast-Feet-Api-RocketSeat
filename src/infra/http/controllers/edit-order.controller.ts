import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { NestEditOrderUseCase } from '../nest-use-cases/nest-edit-order-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editOrderBodySchema = z.object({
  deliveryManId: z.string().uuid().optional(),
  name: z.string().optional(),
  status: z
    .enum(['waiting', 'withdrawal', 'returned', 'delivered'])
    .default('waiting'),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

@Controller('/orders/:orderId/edit')
export class EditOrderController {
  constructor(private nestEditOrder: NestEditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param('orderId') orderId: string
  ) {
    const { name, status, deliveryManId } = body

    const result = await this.nestEditOrder.execute({
      orderId,
      deliveryManId,
      name,
      status,
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
