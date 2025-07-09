import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { RecipientFactory } from 'test/factories/make-recipient'
import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Create Order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let accountFactory: AccountFactory
  let recipientFactory: RecipientFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    accountFactory = moduleRef.get(AccountFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    await app.init()
  })

  test('[POST] /recipients/:recipientId/orders', async () => {
    const admin = await accountFactory.makePrismaEmployee({ rule: 'admin' })

    const accessToken = jwt.sign({ sub: admin.id.toString(), rule: admin.rule })

    const recipient = await recipientFactory.makePrismaRecipient()

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
