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

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

@Controller('/accounts/:recipientId/edit')
export class EditRecipientController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param('recipientId') recipientId: string
  ) {
    const { name, address, phone } = body

    await this.prisma.recipients.update({
      where: {
        id: recipientId,
      },
      data: {
        name,
        address,
        phone,
      },
    })
  }
}
