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

const onChangePasswordBodySchema = z.object({
  password: z.string().min(8),
})

const bodyValidationPipe = new ZodValidationPipe(onChangePasswordBodySchema)

type OnChangePasswordBodySchema = z.infer<typeof onChangePasswordBodySchema>

@Controller('/accounts/:deliveryManId/change-password')
export class OnChangePasswordController {
  constructor(private prisma: PrismaService) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: OnChangePasswordBodySchema,
    @Param('deliveryManId') deliveryManId: string
  ) {
    const { password } = body

    await this.prisma.accounts.update({
      where: {
        id: deliveryManId,
      },
      data: {
        password,
      },
    })
  }
}
