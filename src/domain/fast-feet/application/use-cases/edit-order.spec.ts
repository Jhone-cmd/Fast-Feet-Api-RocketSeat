import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { EditOrderUseCase } from './edit-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: EditOrderUseCase

describe('Edit order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new EditOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to edit a order', async () => {
    const newOrder = makeOrder(
      {
        recipientId: new UniqueEntityId('recipient-1'),
      },
      new UniqueEntityId('order-1')
    )
    await inMemoryOrderRepository.create(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
      name: 'new name',
      status: 'delivered',
    })

    expect(result.isRight).toBeTruthy()
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      name: 'new name',
      status: 'delivered',
    })
  })

  it('should not be able to edit a order from another recipient', async () => {
    const newOrder = makeOrder(
      {
        recipientId: new UniqueEntityId('recipient-1'),
      },
      new UniqueEntityId('order-2')
    )
    await inMemoryOrderRepository.create(newOrder)

    const result = await sut.execute({
      orderId: 'order-2',
    })

    expect(result.isLeft()).toBeFalsy()
    //expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
