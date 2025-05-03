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
import { NestDeleteRecipientUseCase } from '../nest-use-cases/nest-delete-recipient-use-case'

@Controller('/recipients/:recipientId')
export class DeleteRecipientController {
  constructor(private nestDeleteRecipient: NestDeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(@Param('recipientId') recipientId: string) {
    const result = await this.nestDeleteRecipient.execute({
      recipientId,
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
