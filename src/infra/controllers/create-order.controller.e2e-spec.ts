import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../app.module'
import { PrismaService } from '../prisma/prisma.service'

describe('Create Order (E2E)', () => {
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

  test('[POST] /recipients/:recipientId/orders', async () => {
    const admin = await prisma.accounts.create({
      data: {
        name: 'admin',
        email: 'admin@email.com',
        cpf: '12345678900',
        password: '126456',
        role: 'ADMIN',
      },
    })
    const accessToken = jwt.sign({ sub: admin.id })

    const recipient = await prisma.recipients.create({
      data: {
        name: 'recipient-1',
        cpf: '12345678901',
        phone: '7798888-7777',
        address: 'Rua nada Bairro Grande',
      },
    })

    const response = await request(app.getHttpServer())
      .post(`/recipients/${recipient.id.toString()}/orders`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Create Order 1',
        latitude: -16.0167985,
        longitude: -48.0722519,
      })

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.orders.findFirst({
      where: {
        slug: 'create-order-1',
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
