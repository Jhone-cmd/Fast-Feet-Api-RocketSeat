import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AccountFactory } from 'test/factories/make-employee'
import { NotificationFactory } from 'test/factories/make-notification'
import { RecipientFactory } from 'test/factories/make-recipient'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Read Notification (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let accountFactory: AccountFactory
  let recipientFactory: RecipientFactory
  let notificationFactory: NotificationFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AccountFactory, RecipientFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    accountFactory = moduleRef.get(AccountFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    notificationFactory = moduleRef.get(NotificationFactory)
    await app.init()
  })

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const account = await accountFactory.makePrismaEmployee({})
    const accessToken = jwt.sign({ sub: account.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const recipientId = recipient.id.toString()

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: recipient.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId,
      })

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notifications.findFirst({
      where: {
        recipientId,
      },
    })

    expect(notificationOnDatabase?.readAt).not.toBeNull()
  })
})
