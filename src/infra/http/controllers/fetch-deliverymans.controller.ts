import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { NestFetchDeliverymansUseCase } from '../nest-use-cases/nest-fetch-deliverymans-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

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

    return { deliveryMans }
  }
}
