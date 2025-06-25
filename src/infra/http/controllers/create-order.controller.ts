import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { CreateOrderProperties } from '../api-properties/create-order-properties'
import { NestCreateOrderUseCase } from '../nest-use-cases/nest-create-order-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createOrderBodySchema = z.object({
  name: z.string().min(3),
  status: z
    .enum(['waiting', 'withdrawal', 'returned', 'delivered'])
    .default('waiting'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
})

const bodyValidationSchema = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/recipients/:recipientId/orders')
export class CreateOrderController {
  constructor(private nestCreateOrder: NestCreateOrderUseCase) {}

  @Post()
  @ApiBody({
    description: 'Provide order details to create a new order.',
    type: CreateOrderProperties,
    examples: {
      orderExample: {
        summary: 'Example for a order',
        value: {
          name: 'Order Box',
          status: 'waiting',
          latitude: -15.8466048,
          longitude: -48.0247808,
        },
      },
    },
  })
  @ApiParam({
    name: 'recipientId',
    description:
      'recipientId parameter to check which recipient the order will go to',
  })
  @ApiCreatedResponse({ description: 'Order Creation Successful.' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to administrator.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationSchema) body: CreateOrderBodySchema,
    @Param('recipientId') recipientId: string,
    @CurrentAccount() account: AccountPayload
  ) {
    const adminId = account.sub

    const { name, status, latitude, longitude } = body

    const result = await this.nestCreateOrder.execute({
      adminId,
      name,
      status,
      latitude,
      longitude,
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
