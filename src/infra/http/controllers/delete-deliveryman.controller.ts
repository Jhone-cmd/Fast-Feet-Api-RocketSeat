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
import { ApiTags } from '@nestjs/swagger'
import { NestDeleteDeliveryManUseCase } from '../nest-use-cases/nest-delete-deliveryman-use-case'

@ApiTags('Accounts')
@Controller('/accounts/:deliveryManId')
export class DeleteDeliveryManController {
  constructor(private nestDeleteDeliveryMan: NestDeleteDeliveryManUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Param('deliveryManId') deliveryManId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub
    const result = await this.nestDeleteDeliveryMan.execute({
      adminId,
      deliveryManId,
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
