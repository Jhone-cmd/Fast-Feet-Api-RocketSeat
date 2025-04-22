import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { FetchDeliveryMansController } from './controllers/fetch-deliverymans.controller'
import { FetchRecentOrdersController } from './controllers/fetch-recent-orders.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateOrderController,
    CreateRecipientController,
    FetchDeliveryMansController,
    FetchRecipientsController,
    FetchRecentOrdersController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
