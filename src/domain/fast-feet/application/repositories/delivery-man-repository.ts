import type { DeliveryMan } from '../../enterprise/entities/delivery-man'

export interface DeliveryManRepository {
  create(deliveryman: DeliveryMan): Promise<void>
}
