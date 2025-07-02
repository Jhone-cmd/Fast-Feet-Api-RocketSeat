import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { DatabaseModule } from '@/infra/database/database.module'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('On Change Password (E2E)', () => {
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

  test('[PATCH] /accounts/:deliveryManId/change-password', async () => {
    const admin = await accountFactory.makePrismaEmployee({ rule: 'admin' })
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const deliveryman = await accountFactory.makePrismaEmployee()

    const response = await request(app.getHttpServer())
      .patch(
        `/accounts/${deliveryman.id.toString()}/change-password?role=Admin`
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '12345678',
      })

    expect(response.statusCode).toBe(204)
  })
})
