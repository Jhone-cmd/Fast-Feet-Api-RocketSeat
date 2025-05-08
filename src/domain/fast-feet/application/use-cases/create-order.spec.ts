import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { makeEmployee } from 'test/factories/make-employee'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { CreateOrderUseCase } from './create-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    sut = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryRecipientRepository,
      inMemoryEmployeeRepository
    )
  })

  it('should be able to create an order', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'admin',
        },
        new UniqueEntityId('employee-1')
      )
    )

    const recipient = makeRecipient({}, new UniqueEntityId('recipient-1'))

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'employee-1',
      name: 'Carga de auto valor',
      status: 'waiting',
      recipientId: recipient.id.toString(),
      latitude: 0,
      longitude: 0,
    })

    expect(inMemoryOrderRepository.items).toHaveLength(1)
    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      order: inMemoryOrderRepository.items[0],
    })
  })

  it('should not be able create order without recipient', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'admin',
        },
        new UniqueEntityId('employee-1')
      )
    )
    const result = await sut.execute({
      adminId: 'employee-1',
      name: 'Carga de auto valor',
      status: 'waiting',
      recipientId: '',
      latitude: 0,
      longitude: 0,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should not be able to create a recipient without admin permission', async () => {
    const recipient = makeRecipient({}, new UniqueEntityId('recipient-1'))

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      adminId: 'employee-2',
      name: 'Carga de auto valor',
      status: 'waiting',
      recipientId: recipient.id.toString(),
      latitude: 0,
      longitude: 0,
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
