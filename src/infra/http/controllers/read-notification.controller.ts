import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { NestReadNotificationUseCase } from '../nest-use-cases/nest-read-notification-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const readNotificationBodySchema = z.object({
  recipientId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(readNotificationBodySchema)

type ReadNotificationBodySchema = z.infer<typeof readNotificationBodySchema>

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private nestReadNotification: NestReadNotificationUseCase) {}

  @Patch()
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
