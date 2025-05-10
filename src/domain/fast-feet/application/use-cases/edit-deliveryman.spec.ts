import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { FakerHasher } from 'test/cryptography/faker-hasher'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { EditDeliveryManUseCase } from './edit-deliveryman'

let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let fakerHasher: FakerHasher
let sut: EditDeliveryManUseCase

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    fakerHasher = new FakerHasher()
    sut = new EditDeliveryManUseCase(inMemoryEmployeeRepository, fakerHasher)
  })

  it('should be able to edit a deliveryman', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'admin',
        },
        new UniqueEntityId('employee-1')
      )
    )

    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'deliveryman',
        },
        new UniqueEntityId('deliveryman-1')
      )
    )

    const result = await sut.execute({
      adminId: 'employee-1',
      deliveryManId: 'deliveryman-1',
      name: 'new name',
      email: 'newname@email.com',
      password: '123456789',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryEmployeeRepository.items[1]).toMatchObject({
      password: '123456789-hashed',
    })
  })

  it('should not be able to edit a deliveryman without admin permission', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee({}, new UniqueEntityId('employee-1'))
    )

    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'deliveryman',
        },
        new UniqueEntityId('deliveryman-1')
      )
    )

    const result = await sut.execute({
      adminId: 'employee-1',
      deliveryManId: 'deliveryman-1',
      name: 'new name',
      email: 'newname@email.com',
      password: '123456789',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
