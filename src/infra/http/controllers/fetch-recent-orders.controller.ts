import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'
import { CurrentAccount } from '@/infra/auth/current-account-decorator'
import { AccountPayload } from '@/infra/auth/jwt.strategy'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { NestFetchRecentOrdersUseCase } from '../nest-use-cases/nest-fetch-recent-orders-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderDetailsPresenter } from '../presenters/order-details-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders')
export class FetchRecentOrdersController {
  constructor(private nestFetchRecentOrders: NestFetchRecentOrdersUseCase) {}

  @Get()
  @ApiOkResponse({
    description: 'List of Orders.',
    example: {
      orders: [
        {
          id: '81c99058-4e30-41f9-b18b-ac7c48a966de',
          name: 'order 1',
          slug: 'order-1',
          status: 'waiting',
          deliveryman: 'Fábio Nunes',
          recipient: 'Roberto Silva',
          latitude: -15.8466048,
          longitude: -48.0247808,
          createdAt: '2025-06-20T13:33:33.199Z',
          updatedAt: '2025-06-20T13:57:14.296Z',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted.',
  })
  @ApiQuery({
    name: 'page',
    default: 1,
    required: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @UseGuards(JwtAuthGuard)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentAccount() account: AccountPayload
  ) {
    const { rule } = account
    if (rule !== 'admin') {
      throw new UnauthorizedException(
        'Unauthorized. Access restricted to administrator.'
      )
    }

    const result = await this.nestFetchRecentOrders.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderDetailsPresenter.toHttp) }
  }
}
