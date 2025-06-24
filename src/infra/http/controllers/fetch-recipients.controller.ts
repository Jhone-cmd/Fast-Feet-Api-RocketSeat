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
import { NestFetchRecipientsUseCase } from '../nest-use-cases/nest-fetch-recipients-use-case'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { RecipientPresenter } from '../presenters/recipient-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@ApiTags('Recipients')
@ApiBearerAuth()
@Controller('/accounts/recipients')
export class FetchRecipientsController {
  constructor(private nestFetchRecipients: NestFetchRecipientsUseCase) {}

  @Get()
  @ApiOkResponse({
    description: 'List of Recipients.',
    example: {
      recipients: [
        {
          id: 'b218cd7f-24ef-55f2-84vb-eb5b274065b9',
          name: 'recipient',
          cpf: '01234567890',
          phone: '55 94561-6547',
          address: 'DC Street Left',
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
    const result = await this.nestFetchRecipients.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const recipients = result.value.recipients

    return { recipients: recipients.map(RecipientPresenter.toHttp) }
  }
}
