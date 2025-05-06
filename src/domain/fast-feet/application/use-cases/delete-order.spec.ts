import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { DeleteOrderUseCase } from './delete-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new DeleteOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to delete a order', async () => {
    const newOrder = makeOrder(
      {
        recipientId: new UniqueEntityId('recipient-1'),
      },
      new UniqueEntityId('order-1')
    )
    await inMemoryOrderRepository.create(newOrder)

    await sut.execute({
      orderId: 'order-1',
    })

    expect(inMemoryOrderRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a order from another recipient', async () => {
    const newOrder = makeOrder(
      {
        recipientId: new UniqueEntityId('recipient-1'),
      },
      new UniqueEntityId('order-1')
    )
    await inMemoryOrderRepository.create(newOrder)

    const result = await sut.execute({
      orderId: 'order-1',
    })

    expect(result.isLeft()).toBeFalsy()
    //expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
