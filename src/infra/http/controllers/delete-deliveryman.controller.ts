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
import { NestDeleteDeliveryManUseCase } from '../nest-use-cases/nest-delete-deliveryman-use-case'

@Controller('/accounts/:deliveryManId')
export class DeleteDeliveryManController {
  constructor(private nestDeleteDeliveryMan: NestDeleteDeliveryManUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(@Param('deliveryManId') deliveryManId: string) {
    const result = await this.nestDeleteDeliveryMan.execute({
      deliveryManId,
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
