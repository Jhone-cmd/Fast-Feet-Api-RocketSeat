import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const onOrderStatusBodySchema = z.object({
  status: z
    .enum(['waiting', 'withdrawal', 'returned', 'delivered'])
    .default('waiting'),
})

const bodyValidationPipe = new ZodValidationPipe(onOrderStatusBodySchema)

type OnOrderStatusBodySchema = z.infer<typeof onOrderStatusBodySchema>

@Controller('/orders/:orderId/status')
export class OnOrderStatusController {
  constructor(private prisma: PrismaService) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: OnOrderStatusBodySchema,
    @Param('orderId') orderId: string
  ) {
    const { status } = body

    await this.prisma.orders.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
    })
  }
}
