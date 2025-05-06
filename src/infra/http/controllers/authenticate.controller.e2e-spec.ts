import { CPF } from '@/domain/fast-feet/enterprise/entities/value-objects/cpf'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let accountFactory: AccountFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    accountFactory = moduleRef.get(AccountFactory)
    await app.init()
  })

  test('[POST] /sessions', async () => {
    await accountFactory.makePrismaEmployee({
      cpf: new CPF('12345678900'),
      password: await hash('123456', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      cpf: '12345678900',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
