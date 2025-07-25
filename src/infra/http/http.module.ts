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
import { FetchOrdersPerDeliveryManController } from './controllers/fetch-orders-per-deliveryman.controller'
import { FetchRecentOrdersController } from './controllers/fetch-recent-orders.controller'
import { FetchRecipientsController } from './controllers/fetch-recipients.controller'
import { HomeController } from './controllers/home.controller'
import { OnChangePasswordController } from './controllers/on-change-password.controller'
import { OnOrderStatusController } from './controllers/on-order-status.controller'
import { ReadNotificationController } from './controllers/read-notification.controller'
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
import { NestFetchOrdersPerDeliveryManUseCase } from './nest-use-cases/nest-fetch-order-per-deliveryman-use-case'
import { NestFetchRecentOrdersUseCase } from './nest-use-cases/nest-fetch-recent-orders-use-case'
import { NestFetchRecipientsUseCase } from './nest-use-cases/nest-fetch-recipients-use-case'
import { NestOnChangePasswordUseCase } from './nest-use-cases/nest-on-change-password-use-case'
import { NestOnOrderStatusUseCase } from './nest-use-cases/nest-on-order-status-use-case'
import { NestReadNotificationUseCase } from './nest-use-cases/nest-read-notification-use-case'
import { NestUploadAndCreateAttachmentUseCase } from './nest-use-cases/nest-upload-create-attachment-use-case'
import { StorageModule } from './storage/storage.module'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    HomeController,
    CreateAccountController,
    AuthenticateController,
    CreateOrderController,
    CreateRecipientController,
    FetchDeliveryMansController,
    FetchRecipientsController,
    FetchRecentOrdersController,
    FetchNearbyOrdersController,
    FetchOrdersPerDeliveryManController,
    EditDeliveryManController,
    EditRecipientController,
    EditOrderController,
    DeleteDeliveryManController,
    DeleteRecipientController,
    DeleteOrderController,
    UploadCreateAttachmentController,
    OnChangePasswordController,
    OnOrderStatusController,
    ReadNotificationController,
  ],
  providers: [
    NestCreateAccountUseCase,
    NestFetchDeliverymansUseCase,
    NestCreateRecipientUseCase,
    NestFetchRecipientsUseCase,
    NestCreateOrderUseCase,
    NestFetchRecentOrdersUseCase,
    NestFetchNearbyOrdersUseCase,
    NestFetchOrdersPerDeliveryManUseCase,
    NestEditDeliveryManUseCase,
    NestEditRecipientUseCase,
    NestEditOrderUseCase,
    NestDeleteDeliveryManUseCase,
    NestDeleteRecipientUseCase,
    NestDeleteOrderUseCase,
    NestUploadAndCreateAttachmentUseCase,
    NestOnChangePasswordUseCase,
    NestOnOrderStatusUseCase,
    NestReadNotificationUseCase,
  ],
})
export class HttpModule {}
