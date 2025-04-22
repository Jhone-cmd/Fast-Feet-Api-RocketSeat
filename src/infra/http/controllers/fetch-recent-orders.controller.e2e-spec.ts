import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Fetch Recent Orders (E2E)', () => {
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

  test('[GET] /orders', async () => {
    const admin = await prisma.accounts.create({
      data: {
        name: 'admin',
        email: 'admin@email.com',
        cpf: '12345678900',
        password: '123456',
        role: 'ADMIN',
      },
    })

    const recipient = await prisma.recipients.create({
      data: {
        name: 'recipient-1',
        cpf: '12345678901',
        phone: '7798888-7777',
        address: 'Rua nada Bairro Grande',
      },
    })

    const accessToken = jwt.sign({ sub: admin.id })

    await prisma.orders.createMany({
      data: [
        {
          name: 'Create Order 1',
          slug: 'create-order-1',
          recipient_id: recipient.id.toString(),
          latitude: -16.0167985,
          longitude: -48.0722519,
        },
        {
          name: 'Create Order 2',
          slug: 'create-order-2',
          recipient_id: recipient.id.toString(),
          latitude: -16.0167985,
          longitude: -48.0722519,
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: [
        expect.objectContaining({ slug: 'create-order-1' }),
        expect.objectContaining({ slug: 'create-order-2' }),
      ],
    })
  })
})
