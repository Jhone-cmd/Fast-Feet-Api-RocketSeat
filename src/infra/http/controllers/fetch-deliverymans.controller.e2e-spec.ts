import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Fetch Deliverymans (E2E)', () => {
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

  test('[GET] /accounts/deliverymans', async () => {
    const admin = await prisma.accounts.create({
      data: {
        name: 'admin',
        email: 'admin@email.com',
        cpf: '12345678900',
        password: '123456',
        role: 'admin',
      },
    })

    const accessToken = jwt.sign({ sub: admin.id })

    await prisma.accounts.createMany({
      data: [
        {
          name: 'deliveryman1',
          email: 'deliveryman1@email.com',
          cpf: '12345678901',
          password: '123456',
        },
        {
          name: 'deliveryman2',
          email: 'deliveryman2@email.com',
          cpf: '12345678902',
          password: '123456',
        },
      ],
    })

    const response = await request(app.getHttpServer())
      .get('/accounts/deliverymans')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryMans: expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({ email: 'deliveryman1@email.com' }),
        }),
        expect.objectContaining({
          props: expect.objectContaining({ email: 'deliveryman2@email.com' }),
        }),
      ]),
    })
  })
})
