import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchOrdersPerDeliveryManUseCase } from './fetch-orders-per-deliveryman'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchOrdersPerDeliveryManUseCase

describe('Fetch Orders Per Deliveryman', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new FetchOrdersPerDeliveryManUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch order per deliveryman', async () => {
    await inMemoryOrderRepository.create(
      makeOrder(
        {
          createdAt: new Date(2025, 1, 12),
          deliveryManId: new UniqueEntityId('deliveryman'),
        },
        new UniqueEntityId('order-1')
      )
    )

    await inMemoryOrderRepository.create(
      makeOrder(
        {
          createdAt: new Date(2025, 1, 10),
          deliveryManId: new UniqueEntityId('deliveryman'),
        },
        new UniqueEntityId('order-2')
      )
    )

    await inMemoryOrderRepository.create(
      makeOrder(
        {
          createdAt: new Date(2025, 1, 15),
          deliveryManId: new UniqueEntityId('deliveryman'),
        },
        new UniqueEntityId('order-3')
      )
    )

    const result = await sut.execute({
      deliveryManId: 'deliveryman',
      page: 1,
    })

    expect(result.value?.orders).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 1, 15) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 12) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 10) }),
    ])
  })

  it('should be able to fetch paginated per deliveryman order', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryOrderRepository.create(
        makeOrder({ deliveryManId: new UniqueEntityId('deliveryman') })
      )
    }

    const result = await sut.execute({
      deliveryManId: 'deliveryman',
      page: 2,
    })

    expect(result.value?.orders).toHaveLength(2)
  })
})
