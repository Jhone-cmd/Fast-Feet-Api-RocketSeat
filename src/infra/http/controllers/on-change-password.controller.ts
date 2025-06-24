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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ChangeAccountPasswordProperties } from '../api-properties/change-account-password-properties'
import { NestOnChangePasswordUseCase } from '../nest-use-cases/nest-on-change-password-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const onChangePasswordBodySchema = z.object({
  password: z.string().min(8),
})

const bodyValidationPipe = new ZodValidationPipe(onChangePasswordBodySchema)

type OnChangePasswordBodySchema = z.infer<typeof onChangePasswordBodySchema>

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('/accounts/:deliveryManId/change-password')
export class OnChangePasswordController {
  constructor(private nestOnChangePassword: NestOnChangePasswordUseCase) {}

  @Patch()
  @ApiBody({
    description: 'Provide new password for updated',
    type: ChangeAccountPasswordProperties,
  })
  @ApiNoContentResponse({
    description: 'Changed Account Password Successfully.',
  })
  @ApiParam({
    name: 'deliveryManId',
    description:
      'DeliverymanId parameter to check which account to change password.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to administrator.',
  })
  @ApiBadRequestResponse({ description: 'Resource not found.' })
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
