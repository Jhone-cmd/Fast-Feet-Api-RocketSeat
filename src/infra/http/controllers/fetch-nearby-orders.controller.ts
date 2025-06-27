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
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

import { NestFetchNearbyOrdersUseCase } from '../nest-use-cases/nest-fetch-nearby-orders-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchNearbyOrdersQueryParamSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1)),
})

// const pageQueryParamSchema = z
//   .string()
//   .optional()
//   .default('1')
//   .transform(Number)
//   .pipe(z.number().min(1))

// const paramValidationPipe = new ZodValidationPipe(
//   fetchNearbyOrdersQueryParamSchema
// )
const queryValidationPipe = new ZodValidationPipe(
  fetchNearbyOrdersQueryParamSchema
)

type FetchNearbyOrdersQueryParamSchema = z.infer<
  typeof fetchNearbyOrdersQueryParamSchema
>
// type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/nearby/')
export class FetchNearbyOrdersController {
  constructor(private nestFetchNearbyOrders: NestFetchNearbyOrdersUseCase) {}

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
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted.',
  })
  @ApiQuery({
    name: 'latitude',
    default: -15.8466048,
  })
  @ApiQuery({
    name: 'longitude',
    default: -48.0247808,
  })
  @ApiQuery({
    name: 'page',
    default: 1,
    required: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @UseGuards(JwtAuthGuard)
  async handle(
    @Query(queryValidationPipe) {
      page,
      latitude,
      longitude,
    }: FetchNearbyOrdersQueryParamSchema
  ) {
    const result = await this.nestFetchNearbyOrders.execute({
      userLatitude: latitude,
      userLongitude: longitude,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderPresenter.toHttp) }
  }
}
