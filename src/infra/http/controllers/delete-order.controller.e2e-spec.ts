import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Delete Order (E2E)', () => {
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

  test('[DELETE] /orders/:orderId', async () => {
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
        phone: '88 97654-3210',
        address: 'Rua Velha',
      },
    })

    const order = await prisma.orders.create({
      data: {
        name: 'Create Order 1',
        slug: 'create-order-1',
        recipientId: recipient.id,
        latitude: -16.0167985,
        longitude: -48.0722519,
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)
    const orderOnDatabase = await prisma.orders.findUnique({
      where: {
        id: order.id,
      },
    })

    expect(orderOnDatabase).toBeNull()
  })
})
