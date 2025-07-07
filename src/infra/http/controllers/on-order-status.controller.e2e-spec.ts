import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { OrderFactory } from 'test/factories/make-order'
import { OrderAttachmentFactory } from 'test/factories/make-order-attachment'
import { RecipientFactory } from 'test/factories/make-recipient'
import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('On Order Status (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let accountFactory: AccountFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let orderAttachmentFactory: OrderAttachmentFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AccountFactory,
        RecipientFactory,
        OrderFactory,
        OrderAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    accountFactory = moduleRef.get(AccountFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    orderAttachmentFactory = moduleRef.get(OrderAttachmentFactory)
    await app.init()
  })

  test('[PATCH] /orders/:orderId/status', async () => {
    const account = await accountFactory.makePrismaEmployee({})
    const accessToken = jwt.sign({ sub: account.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const order = await orderFactory.makePrismaOrder({
      deliveryManId: account.id,
      recipientId: recipient.id,
    })

    const orderId = order.id

    const result = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/order.jpg')

    const { attachmentId } = result.body

    await orderAttachmentFactory.makePrismaOrderAttachment({
      attachmentId,
      orderId,
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'delivered',
      })

    expect(response.statusCode).toBe(204)
  })
})
