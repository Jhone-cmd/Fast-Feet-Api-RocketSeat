import { Controller, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PrismaService } from '../prisma/prisma.service'

// const createAccountBodySchema = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   cpf: z.string().length(11),
//   password: z.string(),
// })

// type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async handle() {
    return 'ok'
  }
}
