import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { NestDeleteOrderUseCase } from '../nest-use-cases/nest-delete-order-use-case'

@Controller('/orders/:orderId')
export class DeleteOrderController {
  constructor(private nestDeleteOrder: NestDeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Param('orderId') orderId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const result = await this.nestDeleteOrder.execute({
      adminId,
      orderId,
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
