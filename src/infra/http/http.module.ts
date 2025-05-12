import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { DeleteDeliveryManController } from './controllers/delete-deliveryman.controller'
import { DeleteOrderController } from './controllers/delete-order.controller'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { EditDeliveryManController } from './controllers/edit-deliveryman.controller'
import { EditOrderController } from './controllers/edit-order.controller'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { FetchDeliveryMansController } from './controllers/fetch-deliverymans.controller'
import { FetchNearbyOrdersController } from './controllers/fetch-nearby-orders.controller'
import { FetchRecentOrdersController } from './controllers/fetch-recent-orders.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { UploadCreateAttachmentController } from './controllers/upload-create-attachment.controller'
import { NestCreateAccountUseCase } from './nest-use-cases/nest-create-account-use-case'
import { NestCreateOrderUseCase } from './nest-use-cases/nest-create-order-use-case'
import { NestCreateRecipientUseCase } from './nest-use-cases/nest-create-recipient-use-case'
import { NestDeleteDeliveryManUseCase } from './nest-use-cases/nest-delete-deliveryman-use-case'
import { NestDeleteOrderUseCase } from './nest-use-cases/nest-delete-order-use-case'
import { NestDeleteRecipientUseCase } from './nest-use-cases/nest-delete-recipient-use-case'
import { NestEditDeliveryManUseCase } from './nest-use-cases/nest-edit-deliveryman-use-case'
import { NestEditOrderUseCase } from './nest-use-cases/nest-edit-order-use-case'
import { NestEditRecipientUseCase } from './nest-use-cases/nest-edit-recipient-use-case'
import { NestFetchDeliverymansUseCase } from './nest-use-cases/nest-fetch-deliverymans-use-case'
import { NestFetchNearbyOrdersUseCase } from './nest-use-cases/nest-fetch-nearby-orders-use-case'
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
    EditDeliveryManController,
    EditRecipientController,
    EditOrderController,
    DeleteDeliveryManController,
    DeleteRecipientController,
    DeleteOrderController,
    UploadCreateAttachmentController,
  ],
  providers: [
    NestCreateAccountUseCase,
    NestFetchDeliverymansUseCase,
    NestCreateRecipientUseCase,
    NestFetchRecipientsUseCase,
    NestCreateOrderUseCase,
    NestFetchRecentOrdersUseCase,
    NestFetchNearbyOrdersUseCase,
    NestEditDeliveryManUseCase,
    NestEditRecipientUseCase,
    NestEditOrderUseCase,
    NestDeleteDeliveryManUseCase,
    NestDeleteRecipientUseCase,
    NestDeleteOrderUseCase,
  ],
})
export class HttpModule {}
