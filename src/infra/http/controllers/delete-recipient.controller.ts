import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common'

@Controller('/recipients/:recipientId')
export class DeleteRecipientController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(@Param('recipientId') recipientId: string) {
    await this.prisma.recipients.delete({
      where: {
        id: recipientId,
      },
    })
  }
}
