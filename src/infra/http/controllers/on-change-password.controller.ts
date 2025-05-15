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
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { NestOnChangePasswordUseCase } from '../nest-use-cases/nest-on-change-password-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const onChangePasswordBodySchema = z.object({
  password: z.string().min(8),
})

const bodyValidationPipe = new ZodValidationPipe(onChangePasswordBodySchema)

type OnChangePasswordBodySchema = z.infer<typeof onChangePasswordBodySchema>

@Controller('/accounts/:deliveryManId/change-password')
export class OnChangePasswordController {
  constructor(private nestOnChangePassword: NestOnChangePasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: OnChangePasswordBodySchema,
    @Param('deliveryManId') deliveryManId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const { password } = body

    const result = await this.nestOnChangePassword.execute({
      adminId,
      deliveryManId,
      password,
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
