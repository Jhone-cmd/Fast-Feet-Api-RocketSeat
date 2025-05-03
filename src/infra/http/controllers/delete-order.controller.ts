import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common'

@Controller('/orders/:orderId')
export class DeleteOrderController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(@Param('orderId') orderId: string) {
    await this.prisma.orders.delete({
      where: {
        id: orderId,
      },
    })
  }
}
