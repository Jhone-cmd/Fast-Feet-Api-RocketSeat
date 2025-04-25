import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { FetchDeliveryMansController } from './controllers/fetch-deliverymans.controller'
import { FetchRecentOrdersController } from './controllers/fetch-recent-orders.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { NestCreateAccountUseCase } from './nest-use-cases/nest-create-account-use-case'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateOrderController,
    CreateRecipientController,
    FetchDeliveryMansController,
    FetchRecipientsController,
    FetchRecentOrdersController,
  ],
  providers: [NestCreateAccountUseCase],
})
export class HttpModule {}
