import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common'

@Controller('/accounts/:deliverymanId')
export class DeleteDeliveryManController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(@Param('deliverymanId') deliverymanId: string) {
    await this.prisma.accounts.delete({
      where: {
        id: deliverymanId,
      },
    })
  }
}
