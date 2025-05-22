import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('On Order Change Status - Notification (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let accountFactory: AccountFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    accountFactory = moduleRef.get(AccountFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    await app.init()
  })

  it('should to able send a notification when order status change', async () => {
    const account = await accountFactory.makePrismaEmployee({})
    const accessToken = jwt.sign({ sub: account.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const order = await orderFactory.makePrismaOrder({
      recipientId: recipient.id,
    })

    await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'withdrawal',
      })

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notifications.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
