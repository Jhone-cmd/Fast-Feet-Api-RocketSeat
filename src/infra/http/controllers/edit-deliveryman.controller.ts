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
import { NestEditDeliveryManUseCase } from '../nest-use-cases/nest-edit-deliveryman-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editDeliveryManBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliveryManBodySchema)

type EditDeliveryManBodySchema = z.infer<typeof editDeliveryManBodySchema>

@Controller('/accounts/:deliverymanId')
export class EditDeliveryManController {
  constructor(private nestEditDeliveryMan: NestEditDeliveryManUseCase) {}

  @Put()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryManBodySchema,
    @Param('deliverymanId') deliverymanId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const { name, email, password } = body

    const result = await this.nestEditDeliveryMan.execute({
      adminId,
      deliveryManId: deliverymanId,
      name,
      email,
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
