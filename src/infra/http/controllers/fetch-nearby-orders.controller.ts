import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { NestFetchNearbyOrdersUseCase } from '../nest-use-cases/nest-fetch-nearby-orders-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchNearbyOrdersBodySchema = z.object({
  userLatitude: z.coerce.number(),
  userLongitude: z.coerce.number(),
})

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const bodyValidationPipe = new ZodValidationPipe(fetchNearbyOrdersBodySchema)
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type FetchNearbyOrdersBodySchema = z.infer<typeof fetchNearbyOrdersBodySchema>
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@ApiTags('Orders')
@Controller('/orders/nearby')
export class FetchNearbyOrdersController {
  constructor(private nestFetchNearbyOrders: NestFetchNearbyOrdersUseCase) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: FetchNearbyOrdersBodySchema,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const { userLatitude, userLongitude } = body

    const result = await this.nestFetchNearbyOrders.execute({
      userLatitude,
      userLongitude,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderPresenter.toHttp) }
  }
}
