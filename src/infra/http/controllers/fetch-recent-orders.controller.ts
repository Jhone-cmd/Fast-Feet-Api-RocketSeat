import {
  BadRequestException,
  Controller,
  Get,
  Query,
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
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { NestFetchRecentOrdersUseCase } from '../nest-use-cases/nest-fetch-recent-orders-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

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
          latitude: -15.8466048,
          longitude: -48.0247808,
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
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.nestFetchRecentOrders.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderPresenter.toHttp) }
  }
}
