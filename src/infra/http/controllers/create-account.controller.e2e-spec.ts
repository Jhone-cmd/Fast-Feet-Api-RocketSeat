import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'deliveryman',
      email: 'deliveryman@email.com',
      cpf: '12345678901',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const accountOnDatabase = await prisma.accounts.findUnique({
      where: {
        cpf: '12345678901',
      },
    })

    expect(accountOnDatabase).toBeTruthy()
  })
})
