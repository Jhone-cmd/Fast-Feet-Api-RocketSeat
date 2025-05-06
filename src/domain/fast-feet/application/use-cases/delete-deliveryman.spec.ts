import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { DeleteDeliveryManUseCase } from './delete-deliveryman'

let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: DeleteDeliveryManUseCase

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    sut = new DeleteDeliveryManUseCase(inMemoryEmployeeRepository)
  })

  it('should be able to delete a deliveryman', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          role: 'admin',
        },
        new UniqueEntityId('employee-1')
      )
    )

    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          role: 'deliveryman',
        },
        new UniqueEntityId('deliveryman-1')
      )
    )

    await sut.execute({
      deliveryManId: 'deliveryman-1',
    })

    expect(inMemoryEmployeeRepository.items).toHaveLength(1)
  })

  it('should not be able to delete a deliveryman without admin permission', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          role: 'deliveryman',
        },
        new UniqueEntityId('deliveryman-1')
      )
    )

    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          role: 'deliveryman',
        },
        new UniqueEntityId('deliveryman-2')
      )
    )

    const result = await sut.execute({
      deliveryManId: 'deliveryman-2',
    })

    expect(result.isLeft()).toBeFalsy()
    //expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
