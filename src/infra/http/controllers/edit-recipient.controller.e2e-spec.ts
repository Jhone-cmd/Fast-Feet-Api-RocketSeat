import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Edit Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[PUT] /accounts/:recipientId/edit', async () => {
    const admin = await prisma.accounts.create({
      data: {
        name: 'admin',
        email: 'admin@email.com',
        cpf: '12345678900',
        password: '126456',
        role: 'admin',
      },
    })
    const accessToken = jwt.sign({ sub: admin.id })

    const recipient = await prisma.recipients.create({
      data: {
        name: 'recipient-1',
        cpf: '12345678901',
        address: 'Rua nova',
        phone: '55 88 98888-7777',
      },
    })

    const response = await request(app.getHttpServer())
      .put(`/accounts/${recipient.id}/edit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'recipient',
      })

    expect(response.statusCode).toBe(204)
    const recipientOnDatabase = await prisma.recipients.findFirst({
      where: {
        name: 'recipient',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
