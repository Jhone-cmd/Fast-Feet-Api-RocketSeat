import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { RecipientFactory } from 'test/factories/make-recipient'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Edit Recipient (E2E)', () => {
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

  test('[PUT] /recipients/:recipientId', async () => {
    const admin = await accountFactory.makePrismaEmployee({ rule: 'admin' })

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const response = await request(app.getHttpServer())
      .put(`/recipients/${recipient.id.toString()}`)
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
