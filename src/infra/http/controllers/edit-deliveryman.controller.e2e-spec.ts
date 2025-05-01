import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Edit Deliveryman (E2E)', () => {
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

  test('[PUT] /accounts/:deliverymanId/edit', async () => {
    const admin = await prisma.accounts.create({
      data: {
        name: 'admin',
        email: 'admin@email.com',
        cpf: '12345678900',
        password: '126456',
        role: 'admin',
      },
    })
    const accessToken = jwt.sign({ sub: admin.id })

    const deliveryman = await prisma.accounts.create({
      data: {
        name: 'deliveryman',
        email: 'deliveryman@email.com',
        cpf: '12345678901',
        password: '126456',
      },
    })

    const response = await request(app.getHttpServer())
      .put(`/accounts/${deliveryman.id.toString()}/edit`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'deliveryman2@email.com',
      })

    console.log(response.body)

    expect(response.statusCode).toBe(204)
    const accountOnDatabase = await prisma.accounts.findUnique({
      where: {
        email: 'deliveryman2@email.com',
      },
    })

    expect(accountOnDatabase).toBeTruthy()
  })
})
