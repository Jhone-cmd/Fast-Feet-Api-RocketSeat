import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Order,
  type OrderProps,
} from '@/domain/fast-feet/enterprise/entities/order'
import { faker } from '@faker-js/faker'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId
) {
  const order = Order.create(
    {
      name: faker.lorem.sentence(),
      recipientId: new UniqueEntityId(),
      status: 'waiting',
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id
  )

  return order
}
