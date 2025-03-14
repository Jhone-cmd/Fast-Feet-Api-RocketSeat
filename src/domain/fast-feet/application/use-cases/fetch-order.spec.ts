import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchOrderUseCase } from './fetch-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchOrderUseCase

describe('Fetch Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new FetchOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch order', async () => {
    await inMemoryOrderRepository.create(
      makeOrder(
        {
          createdAt: new Date(2025, 1, 12),
        },
        new UniqueEntityId('order-1')
      )
    )

    await inMemoryOrderRepository.create(
      makeOrder(
        {
          createdAt: new Date(2025, 1, 10),
        },
        new UniqueEntityId('order-2')
      )
    )

    await inMemoryOrderRepository.create(
      makeOrder(
        {
          createdAt: new Date(2025, 1, 15),
        },
        new UniqueEntityId('order-3')
      )
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.order).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 1, 15) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 12) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 10) }),
    ])
  })

  it('should be able to fetch paginated order', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryOrderRepository.create(makeOrder())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.order).toHaveLength(2)
  })
})
