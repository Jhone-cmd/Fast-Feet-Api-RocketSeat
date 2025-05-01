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
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editDeliveryManBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliveryManBodySchema)

type EditDeliveryManBodySchema = z.infer<typeof editDeliveryManBodySchema>

@Controller('/accounts/:deliverymanId/edit')
export class EditDeliveryManController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryManBodySchema,
    @Param('deliverymanId') deliverymanId: string
  ) {
    const { name, email, password } = body

    const newPassword = password ? await hash(password, 8) : password

    await this.prisma.accounts.update({
      where: {
        id: deliverymanId,
      },
      data: {
        name,
        email,
        password: newPassword,
      },
    })
  }
}
