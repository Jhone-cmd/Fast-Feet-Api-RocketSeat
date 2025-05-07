import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Delete Deliveryman (E2E)', () => {
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

  test('[DELETE] /accounts/:deliveryManId', async () => {
    const admin = await accountFactory.makePrismaEmployee({ role: 'admin' })
    const accessToken = jwt.sign({ sub: admin.id.toString() })

    const deliveryman = await accountFactory.makePrismaEmployee()

    const response = await request(app.getHttpServer())
      .delete(`/accounts/${deliveryman.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)
    const accountOnDatabase = await prisma.accounts.findUnique({
      where: {
        id: deliveryman.id.toString(),
      },
    })

    expect(accountOnDatabase).toBeNull()
  })
})
