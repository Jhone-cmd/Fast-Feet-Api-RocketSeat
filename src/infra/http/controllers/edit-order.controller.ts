import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
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

@Controller('/orders/:orderId')
export class EditOrderController {
  constructor(private nestEditOrder: NestEditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param('orderId') orderId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const { name, status, deliveryManId } = body

    const result = await this.nestEditOrder.execute({
      adminId,
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
        case NotAllowed:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
