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
import { NestFetchDeliverymansUseCase } from '../nest-use-cases/nest-fetch-deliverymans-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryManPresenter } from '../presenters/deliveryman-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Accounts')
@ApiBearerAuth()
@Controller('/accounts/deliverymans')
export class FetchDeliveryMansController {
  constructor(private nestFetchDeliverymans: NestFetchDeliverymansUseCase) {}

  @Get()
  @ApiOkResponse({
    description: 'List of Deliverymans.',
    example: {
      deliverymans: [
        {
          id: 'b218cd6f-24ab-44f2-84vb-eb5a074065b9',
          name: 'deliveryman',
          email: 'deliveryman@example.com',
          cpf: '01234567890',
          rule: 'deliveryman',
        },
      ],
    },
  })
  @ApiQuery({
    name: 'page',
    default: 1,
    required: false,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized. Access restricted to administrator.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request.' })
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.nestFetchDeliverymans.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    const deliveryMans = result.value.deliveryMans

    return { deliverymans: deliveryMans.map(DeliveryManPresenter.toHttp) }
  }
}
