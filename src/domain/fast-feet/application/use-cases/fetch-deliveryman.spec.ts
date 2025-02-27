import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { FetchDeliveryManUseCase } from './fetch-deliveryman'

let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: FetchDeliveryManUseCase

describe('Fetch Deliveryman', () => {
  beforeEach(() => {
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    sut = new FetchDeliveryManUseCase(inMemoryEmployeeRepository)
  })

  it('should be able to fetch deliveryman', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          role: 'deliveryman',
          createdAt: new Date(2025, 1, 12),
        },
        new UniqueEntityId('employee-1')
      )
    )

    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          role: 'deliveryman',
          createdAt: new Date(2025, 1, 10),
        },
        new UniqueEntityId('employee-2')
      )
    )

    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          role: 'deliveryman',
          createdAt: new Date(2025, 1, 15),
        },
        new UniqueEntityId('employee-3')
      )
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.deliveryMan).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 1, 15) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 12) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 10) }),
    ])
  })

  it('should be able to fetch paginated deliveryman', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryEmployeeRepository.create(
        makeEmployee({
          role: 'deliveryman',
        })
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.deliveryMan).toHaveLength(2)
  })
})
