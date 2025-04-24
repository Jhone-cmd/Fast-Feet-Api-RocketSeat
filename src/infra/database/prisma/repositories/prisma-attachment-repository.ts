import { AttachmentRepository } from '@/domain/fast-feet/application/repositories/attachment-repository'
import { Attachment } from '@/domain/fast-feet/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)
    await this.prisma.attachments.create({
      data,
    })
  }
}
