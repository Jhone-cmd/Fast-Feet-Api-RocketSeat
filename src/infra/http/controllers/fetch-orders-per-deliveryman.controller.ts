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
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { NestFetchOrdersPerDeliveryManUseCase } from '../nest-use-cases/nest-fetch-order-per-deliveryman-use-case'
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
@Controller('/accounts/:deliveryManId/orders')
export class FetchOrdersPerDeliveryManController {
  constructor(
    private nestFetchOrdersPerDeliveryMan: NestFetchOrdersPerDeliveryManUseCase
  ) {}

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
          recipient: 'Roberto Silva',
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted.',
  })
  @ApiParam({
    name: 'deliveryManId',
    description:
      'DeliverymanId parameter to check which account to fetch orders.',
  })
  @ApiQuery({
    name: 'page',
    default: 1,
    required: false,
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @UseGuards(JwtAuthGuard)
  async handle(
    @Param('deliveryManId') deliveryManId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const result = await this.nestFetchOrdersPerDeliveryMan.execute({
      deliveryManId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const orders = result.value.orders

    return { orders: orders.map(OrderDetailsPresenter.toHttp) }
  }
}
