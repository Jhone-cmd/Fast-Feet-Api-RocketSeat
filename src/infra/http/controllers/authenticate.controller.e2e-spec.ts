import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../prisma/prisma.service'

describe('Authenticate (E2E)', () => {
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

  test('[POST] /sessions', async () => {
    await prisma.accounts.create({
      data: {
        name: 'admin',
        email: 'admin@email.com',
        cpf: '12345678900',
        password: await hash('123456', 8),
        role: 'ADMIN',
      },
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
