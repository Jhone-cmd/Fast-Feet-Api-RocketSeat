import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Create Recipient (E2E)', () => {
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

  test('[POST] /accounts/recipients', async () => {
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
