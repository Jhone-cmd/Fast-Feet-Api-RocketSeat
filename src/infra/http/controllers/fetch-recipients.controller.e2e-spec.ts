import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { RecipientFactory } from 'test/factories/make-recipient'
import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Fetch Recipients (E2E)', () => {
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

  test('[GET] /accounts/recipients', async () => {
    const admin = await accountFactory.makePrismaEmployee({ rule: 'admin' })

    const accessToken = jwt.sign({ sub: admin.id.toString(), rule: admin.rule })

    await Promise.all([
      recipientFactory.makePrismaRecipient({ name: 'recipient-1' }),
      recipientFactory.makePrismaRecipient({ name: 'recipient-2' }),
    ])

    const response = await request(app.getHttpServer())
      .get('/accounts/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: expect.arrayContaining([
        expect.objectContaining({ name: 'recipient-1' }),
        expect.objectContaining({ name: 'recipient-2' }),
      ]),
    })
  })
})
