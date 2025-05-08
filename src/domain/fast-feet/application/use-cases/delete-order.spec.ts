import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { makeEmployee } from 'test/factories/make-employee'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { DeleteOrderUseCase } from './delete-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: DeleteOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    sut = new DeleteOrderUseCase(
      inMemoryOrderRepository,
      inMemoryEmployeeRepository
    )
  })

  it('should be able to delete a order', async () => {
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

    await sut.execute({
      adminId: 'employee-1',
      orderId: 'order-1',
    })

    expect(inMemoryOrderRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an order without admin permission', async () => {
    const newOrder = makeOrder(
      {
        recipientId: new UniqueEntityId('recipient-1'),
      },
      new UniqueEntityId('order-1')
    )
    await inMemoryOrderRepository.create(newOrder)

    const result = await sut.execute({
      adminId: 'employee-2',
      orderId: 'order-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
