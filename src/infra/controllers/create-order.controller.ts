import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentAccount } from '../auth/current-account-decorator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AccountPayload } from '../auth/jwt.strategy'
import { PrismaService } from '../prisma/prisma.service'
@Controller('/orders')
export class CreateOrderController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async handle(@CurrentAccount() account: AccountPayload) {
    return 'ok'
  }
}
