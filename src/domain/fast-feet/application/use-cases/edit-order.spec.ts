import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { makeEmployee } from 'test/factories/make-employee'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { EditOrderUseCase } from './edit-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: EditOrderUseCase

describe('Edit order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    sut = new EditOrderUseCase(
      inMemoryOrderRepository,
      inMemoryEmployeeRepository
    )
  })

  it('should be able to edit a order', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'admin',
        },
        new UniqueEntityId('employee-1')
      )
    )

    const newOrder = makeOrder(
      {
        recipientId: new UniqueEntityId('recipient-1'),
      },
      new UniqueEntityId('order-1')
    )
    await inMemoryOrderRepository.create(newOrder)

    const result = await sut.execute({
      adminId: 'employee-1',
      orderId: 'order-1',
      name: 'new name',
      status: 'delivered',
    })

    expect(result.isRight).toBeTruthy()
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      name: 'new name',
      status: 'delivered',
    })
  })

  it('should not be able to edit an recipient without admin permission', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee({}, new UniqueEntityId('employee-1'))
    )

    const newOrder = makeOrder(
      {
        recipientId: new UniqueEntityId('recipient-1'),
      },
      new UniqueEntityId('order-1')
    )

    await inMemoryOrderRepository.create(newOrder)

    const result = await sut.execute({
      adminId: 'employee-1',
      orderId: 'order-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
