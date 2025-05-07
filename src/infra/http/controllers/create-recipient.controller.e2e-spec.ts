import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Create Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let accountFactory: AccountFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    accountFactory = moduleRef.get(AccountFactory)
    await app.init()
  })

  test('[POST] /accounts/recipients', async () => {
    const admin = await accountFactory.makePrismaEmployee()

    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/accounts/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'recipient-1',
        cpf: '12345678901',
        phone: '7798888-7777',
        address: 'Rua nada Bairro Grande',
      })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipients.findUnique({
      where: {
        cpf: '12345678901',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
