import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Upload Attachment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /attachments', async () => {
    const response = await request(app.getHttpServer())
      .post('/attachments')
      .send({
        fileTitle: 'attachment-1',
        url: 'http://attachmenturl.com',
      })

    expect(response.statusCode).toBe(201)

    const attachmentOnDatabase = await prisma.attachments.findFirst({
      where: {
        title: 'attachment-1',
      },
    })

    expect(attachmentOnDatabase).toBeTruthy()
  })
})
