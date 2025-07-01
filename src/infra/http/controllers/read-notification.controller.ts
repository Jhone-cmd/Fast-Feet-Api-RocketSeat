import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ReadNotificationProperties } from '../api-properties/read-notification-properties'
import { NestReadNotificationUseCase } from '../nest-use-cases/nest-read-notification-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const readNotificationBodySchema = z.object({
  recipientId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(readNotificationBodySchema)

type ReadNotificationBodySchema = z.infer<typeof readNotificationBodySchema>
@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private nestReadNotification: NestReadNotificationUseCase) {}

  @Patch()
  @ApiBody({
    description: 'Provide recipientId for read notification.',
    type: ReadNotificationProperties,
  })
  @ApiParam({
    name: 'notificationId',
    description:
      'notificationId parameter to check which notification for read.',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to recipient of order.',
  })
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: ReadNotificationBodySchema,
    @Param('notificationId') notificationId: string
  ) {
    const { recipientId } = body

    const result = await this.nestReadNotification.execute({
      recipientId,
      notificationId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFound:
          throw new BadRequestException(error.message)
        case NotAllowed:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
