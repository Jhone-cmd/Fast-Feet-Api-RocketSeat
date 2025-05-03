import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { NestDeleteOrderUseCase } from '../nest-use-cases/nest-delete-order-use-case'

@Controller('/orders/:orderId')
export class DeleteOrderController {
  constructor(private nestDeleteOrder: NestDeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(@Param('orderId') orderId: string) {
    const result = await this.nestDeleteOrder.execute({
      orderId,
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
