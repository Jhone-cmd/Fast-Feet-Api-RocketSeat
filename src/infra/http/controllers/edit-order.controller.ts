import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editOrderBodySchema = z.object({
  deliveryManId: z.string().uuid().optional(),
  name: z.string().optional(),
  status: z
    .enum(['waiting', 'withdrawal', 'returned', 'delivered'])
    .default('waiting'),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

@Controller('/orders/:orderId/edit')
export class EditOrderController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param('orderId') orderid: string
  ) {
    const { name, status, deliveryManId } = body

    await this.prisma.orders.update({
      where: {
        id: orderid,
      },
      data: {
        name,
        status,
        deliverymanId: deliveryManId,
      },
    })
  }
}
