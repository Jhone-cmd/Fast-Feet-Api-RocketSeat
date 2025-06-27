import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

import { NestFetchNearbyOrdersUseCase } from '../nest-use-cases/nest-fetch-nearby-orders-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchNearbyOrdersParamSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
})

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const paramValidationPipe = new ZodValidationPipe(fetchNearbyOrdersParamSchema)
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type FetchNearbyOrdersParamSchema = z.infer<typeof fetchNearbyOrdersParamSchema>
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders/nearby/:latitude/:longitude')
export class FetchNearbyOrdersController {
  constructor(private nestFetchNearbyOrders: NestFetchNearbyOrdersUseCase) {}

  @Get()
  @ApiParam({
    name: 'latitude',
    description: 'The latitude of the user for fetching nearby orders.',
  })
  @ApiParam({
    name: 'longitude',
    description: 'The longitude of the user for fetching nearby orders.',
  })
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
  async handle(
    @Param(paramValidationPipe) {
      latitude,
      longitude,
    }: FetchNearbyOrdersParamSchema,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
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
