import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../prisma/prisma.service'

describe('Fetch Recipients (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    await app.init()
  })

  test('[GET] /accounts/recipients', async () => {
    const admin = await prisma.accounts.create({
      data: {
        name: 'admin',
        email: 'admin@email.com',
        cpf: '12345678900',
        password: '123456',
        role: 'ADMIN',
      },
    })

    const accessToken = jwt.sign({ sub: admin.id })

    await prisma.recipients.createMany({
      data: [
        {
          name: 'recipient-1',
          cpf: '12345678901',
          phone: '7798888-7777',
          address: 'Rua nada Bairro Grande',
        },
        {
          name: 'recipient-2',
          cpf: '12345678902',
          phone: '7798888-7777',
          address: 'Rua nada Bairro Grande',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/accounts/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipients: [
        expect.objectContaining({ cpf: '12345678901' }),
        expect.objectContaining({ cpf: '12345678902' }),
      ],
    })
  })
})
