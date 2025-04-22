import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/accounts/recipients')
export class FetchRecipientsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 20

    const recipients = await this.prisma.recipients.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { recipients }
  }
}
