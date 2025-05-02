import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Edit Order (E2E)', () => {
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

  test('[PUT] /orders/:orderId/edit', async () => {
    const admin = await prisma.accounts.create({
      data: {
        name: 'admin',
        email: 'admin@email.com',
        cpf: '12345678900',
        password: '126456',
        role: 'admin',
      },
    })

    const deliveryMan = await prisma.accounts.create({
      data: {
        name: 'deliveryman',
        email: 'deliveryman@email.com',
        cpf: '12345678902',
        password: '126456',
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

    const order = await prisma.orders.create({
      data: {
        name: 'Order-1',
        slug: 'order-1',
        recipientId: recipient.id,
        latitude: -16.0167985,
        longitude: -48.0722519,
      },
    })

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id}/edit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliveryManId: deliveryMan.id,
        status: 'withdrawal',
      })

    expect(response.statusCode).toBe(204)
    const orderOnDatabase = await prisma.orders.findFirst({
      where: {
        deliverymanId: deliveryMan.id,
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
