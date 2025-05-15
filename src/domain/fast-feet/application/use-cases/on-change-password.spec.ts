import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { FakerHasher } from 'test/cryptography/faker-hasher'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { OnchangePasswordUseCase } from './on-change-password'

let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let fakerHasher: FakerHasher
let sut: OnchangePasswordUseCase

describe('On Change Password', () => {
  beforeEach(() => {
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    fakerHasher = new FakerHasher()
    sut = new OnchangePasswordUseCase(inMemoryEmployeeRepository, fakerHasher)
  })

  it('should be able to onchange password', async () => {
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
      password: '123456',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryEmployeeRepository.items[1]).toMatchObject({
      password: '123456-hashed',
    })
  })

  it('should not be able to onchange password without admin permission', async () => {
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
      password: '123456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
