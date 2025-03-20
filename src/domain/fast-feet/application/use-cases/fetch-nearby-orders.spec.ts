import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchNearbyOrdersUseCase } from './fetch-nearby-orders'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchNearbyOrdersUseCase

describe('Fetch Nearby Orders', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new FetchNearbyOrdersUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch nearby orders', async () => {
    await inMemoryOrderRepository.create(
      makeOrder(
        {
          name: 'order 1',
          createdAt: new Date(2025, 1, 12),
          latitude: -16.0366592,
          longitude: -48.0509952,
        },
        new UniqueEntityId('order-1')
      )
    )

    await inMemoryOrderRepository.create(
      makeOrder(
        {
          name: 'order 2',
          createdAt: new Date(2025, 1, 10),
          latitude: -16.0366592,
          longitude: -48.0509952,
        },
        new UniqueEntityId('order-2')
      )
    )

    await inMemoryOrderRepository.create(
      makeOrder(
        {
          name: 'order 3',
          createdAt: new Date(2025, 1, 15),
          latitude: -16.0366592,
          longitude: -48.0509952,
        },
        new UniqueEntityId('order-3')
      )
    )

    const result = await sut.execute({
      page: 1,
      userLatitude: -16.0366592,
      userLongitude: -48.0509952,
    })

    expect(inMemoryOrderRepository.items).toHaveLength(3)
    expect(result.value?.orders).toEqual([
      expect.objectContaining({
        name: 'order 3',
      }),
      expect.objectContaining({
        name: 'order 1',
      }),
      expect.objectContaining({
        name: 'order 2',
      }),
    ])
  })

  it('should be able to fetch nearby paginated order', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryOrderRepository.create(
        makeOrder({
          latitude: -16.0366592,
          longitude: -48.0509952,
        })
      )
    }

    const result = await sut.execute({
      page: 2,
      userLatitude: -16.0366592,
      userLongitude: -48.0509952,
    })

    expect(result.value?.orders).toHaveLength(2)
  })

  it('should be able to fetch nearby order', async () => {
    await inMemoryOrderRepository.create(
      makeOrder(
        {
          name: 'Near order',
          latitude: -16.0366592,
          longitude: -48.0509952,
        },
        new UniqueEntityId('order-1')
      )
    )

    await inMemoryOrderRepository.create(
      makeOrder(
        {
          name: 'Far order',
          latitude: -15.5560727,
          longitude: -47.9912768,
        },
        new UniqueEntityId('order-2')
      )
    )

    const result = await sut.execute({
      page: 1,
      userLatitude: -16.0366592,
      userLongitude: -48.0509952,
    })

    expect(result.value?.orders).toHaveLength(1)
    expect(result.value?.orders).toEqual([
      expect.objectContaining({ name: 'Near order' }),
    ])
  })
})
