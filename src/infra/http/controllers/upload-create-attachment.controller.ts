import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const attachmentBodySchema = z.object({
  fileTitle: z.string(),
  url: z.string().url(),
})

const bodyValidationPipe = new ZodValidationPipe(attachmentBodySchema)

type AttachmentBodySchema = z.infer<typeof attachmentBodySchema>

@Controller('/attachments')
export class UploadCreateAttachmentController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: AttachmentBodySchema) {
    const { fileTitle, url } = body

    await this.prisma.attachments.create({
      data: {
        title: fileTitle,
        url,
      },
    })
  }
}
