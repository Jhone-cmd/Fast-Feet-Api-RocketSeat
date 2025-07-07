import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { CPF } from '@/domain/fast-feet/enterprise/entities/value-objects/cpf'
import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Fetch Deliverymans (E2E)', () => {
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

  test('[GET] /accounts/deliverymans', async () => {
    const admin = await accountFactory.makePrismaEmployee({ rule: 'admin' })

    const accessToken = jwt.sign({ sub: admin.id.toString(), rule: admin.rule })

    await Promise.all([
      accountFactory.makePrismaEmployee({
        cpf: new CPF('12345678901'),
        rule: 'deliveryman',
      }),
      accountFactory.makePrismaEmployee({
        cpf: new CPF('12345678902'),
        rule: 'deliveryman',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/accounts/deliverymans/')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliverymans: expect.arrayContaining([
        expect.objectContaining({ cpf: '12345678901' }),
        expect.objectContaining({ cpf: '12345678902' }),
      ]),
    })
  })
})
