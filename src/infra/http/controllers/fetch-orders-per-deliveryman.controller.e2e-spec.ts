import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'
import { Slug } from '@/domain/fast-feet/enterprise/entities/value-objects/slug'
import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Fetch Orders Per Deliveryman (E2E)', () => {
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

  test('[GET] /accounts/:deliveryManId/orders', async () => {
    const deliveryman = await accountFactory.makePrismaEmployee()

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        slug: Slug.createFromText('create-order-1'),
        recipientId: recipient.id,
        deliveryManId: deliveryman.id,
      }),
      orderFactory.makePrismaOrder({
        slug: Slug.createFromText('create-order-2'),
        recipientId: recipient.id,
        deliveryManId: deliveryman.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/accounts/${deliveryman.id.toString()}/orders`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({ slug: 'create-order-1' }),
        expect.objectContaining({ slug: 'create-order-2' }),
      ]),
    })
  })
})
