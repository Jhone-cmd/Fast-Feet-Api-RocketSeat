import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard'
import { PrismaService } from '../../database/prisma/prisma.service'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createOrderBodySchema = z.object({
  name: z.string(),
  status: z
    .enum(['waiting', 'withdrawal', 'returned', 'delivered'])
    .default('waiting'),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
})

const bodyValidationSchema = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>
@Controller('/recipients/:recipientId/orders')
export class CreateOrderController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationSchema) body: CreateOrderBodySchema,
    @Param('recipientId') recipientId: string
  ) {
    const { name, status, latitude, longitude } = body

    const slug = this.convertToSlug(name)

    await this.prisma.orders.create({
      data: {
        name,
        slug,
        status,
        latitude,
        longitude,
        recipientId: recipientId,
      },
    })
  }

  private convertToSlug(name: string): string {
    return name
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .replace(/_/g, '-')
      .replace(/-$/g, '')
  }
}
