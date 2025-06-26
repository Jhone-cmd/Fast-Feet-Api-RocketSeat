import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { NestDeleteOrderUseCase } from '../nest-use-cases/nest-delete-order-use-case'
@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/:orderId')
export class DeleteOrderController {
  constructor(private nestDeleteOrder: NestDeleteOrderUseCase) {}

  @Delete()
  @ApiNoContentResponse({ description: 'Order Deleted Successfully.' })
  @ApiParam({
    name: 'orderId',
    description: 'orderId parameter to check which order to delete.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to administrator.',
  })
  @ApiBadRequestResponse({ description: 'Resource not found.' })
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
