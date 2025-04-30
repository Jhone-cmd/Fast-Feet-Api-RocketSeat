import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

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

@Controller('/orders/nearby')
export class FetchNearbyOrdersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: FetchNearbyOrdersBodySchema,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const { userLatitude, userLongitude } = body

    const perPage = 20

    const orders = await this.prisma.orders.findMany({
      where: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return { orders }
  }
}
