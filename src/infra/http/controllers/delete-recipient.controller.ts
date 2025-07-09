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
import { NestDeleteRecipientUseCase } from '../nest-use-cases/nest-delete-recipient-use-case'

@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/recipients/:recipientId')
export class DeleteRecipientController {
  constructor(private nestDeleteRecipient: NestDeleteRecipientUseCase) {}

  @Delete()
  @ApiNoContentResponse({ description: 'Recipient Deleted Successfully.' })
  @ApiParam({
    name: 'recipientId',
    description: 'recipientId parameter to check which recipient to delete.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to administrator.',
  })
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Param('recipientId') recipientId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const { sub: adminId, rule } = account
    if (rule !== 'admin') {
      throw new UnauthorizedException(
        'Unauthorized. Access restricted to administrator.'
      )
    }

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
