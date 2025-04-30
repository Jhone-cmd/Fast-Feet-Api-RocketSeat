import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { FetchDeliveryMansController } from './controllers/fetch-deliverymans.controller'
import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller'
import { FetchRecentOrdersController } from './controllers/fetch-recent-orders.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { NestCreateAccountUseCase } from './nest-use-cases/nest-create-account-use-case'
import { NestCreateOrderUseCase } from './nest-use-cases/nest-create-order-use-case'
import { NestCreateRecipientUseCase } from './nest-use-cases/nest-create-recipient-use-case'
import { NestFetchDeliverymansUseCase } from './nest-use-cases/nest-fetch-deliverymans-use-case'
import { NestFetchRecentOrdersUseCase } from './nest-use-cases/nest-fetch-recent-orders-use-case'
import { NestFetchRecipientsUseCase } from './nest-use-cases/nest-fetch-recipients-use-case'

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
    FetchNearbyOrdersController,
  ],
  providers: [
    NestCreateAccountUseCase,
    NestFetchDeliverymansUseCase,
    NestCreateRecipientUseCase,
    NestFetchRecipientsUseCase,
    NestCreateOrderUseCase,
    NestFetchRecentOrdersUseCase,
  ],
})
export class HttpModule {}
