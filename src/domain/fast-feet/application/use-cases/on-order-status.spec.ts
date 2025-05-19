import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { OnOrderStatusUseCase } from './on-order-status'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: OnOrderStatusUseCase

describe('On Order Status', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new OnOrderStatusUseCase(inMemoryOrderRepository)
  })

  it('should be able to onchange password', async () => {
    await inMemoryOrderRepository.create(
      makeOrder({}, new UniqueEntityId('order-1'))
    )

    const result = await sut.execute({
      orderId: 'order-1',
      status: 'withdrawal',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      status: 'withdrawal',
    })
  })

  it('should not be able to change the status of another order', async () => {
    await inMemoryOrderRepository.create(
      makeOrder({}, new UniqueEntityId('order-1'))
    )

    const result = await sut.execute({
      orderId: 'order-2',
      status: 'withdrawal',
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
