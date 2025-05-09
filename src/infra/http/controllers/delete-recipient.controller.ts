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
import { NestDeleteRecipientUseCase } from '../nest-use-cases/nest-delete-recipient-use-case'

@Controller('/recipients/:recipientId')
export class DeleteRecipientController {
  constructor(private nestDeleteRecipient: NestDeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Param('recipientId') recipientId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const result = await this.nestDeleteRecipient.execute({
      adminId,
      recipientId,
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
