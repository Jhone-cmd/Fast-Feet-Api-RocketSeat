import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
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
