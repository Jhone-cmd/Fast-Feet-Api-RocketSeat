import { makeOrder } from 'test/factories/make-order'
import { makeOrderAttachment } from 'test/factories/make-order-attachment'
import { InMemoryOrderAttachmentRepository } from 'test/repositories/in-memory-order-attachment-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { NotDeliveredOrder } from './errors/not-delivered-order'
import { OnOrderStatusUseCase } from './on-order-status'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentRepository
let sut: OnOrderStatusUseCase

describe('On Order Status', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentRepository()
    sut = new OnOrderStatusUseCase(
      inMemoryOrderRepository,
      inMemoryOrderAttachmentRepository
    )
  })

  it('should be able to on change status', async () => {
    await inMemoryOrderRepository.create(
      makeOrder(
        { deliveryManId: new UniqueEntityId('deliveryman-1') },
        new UniqueEntityId('order-1')
      )
    )

    const result = await sut.execute({
      orderId: 'order-1',
      deliveryManId: 'deliveryman-1',
      status: 'withdrawal',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      status: 'withdrawal',
    })
  })

  it('should not be able to change the status of another order', async () => {
    await inMemoryOrderRepository.create(
      makeOrder(
        { deliveryManId: new UniqueEntityId('deliveryman-1') },
        new UniqueEntityId('order-1')
      )
    )

    const result = await sut.execute({
      orderId: 'order-2',
      deliveryManId: 'deliveryman-1',
      status: 'withdrawal',
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should be able to mark the order as delivered', async () => {
    const order = makeOrder(
      { deliveryManId: new UniqueEntityId('deliveryman-1') },
      new UniqueEntityId('order-1')
    )
    await inMemoryOrderRepository.create(order)

    await inMemoryOrderAttachmentRepository.create(
      makeOrderAttachment({ orderId: order.id }, new UniqueEntityId())
    )

    const result = await sut.execute({
      orderId: 'order-1',
      deliveryManId: 'deliveryman-1',
      status: 'delivered',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      status: 'delivered',
    })
  })

  it('should not be able to mark the order as delivered', async () => {
    await inMemoryOrderRepository.create(
      makeOrder({}, new UniqueEntityId('order-1'))
    )

    const result = await sut.execute({
      orderId: 'order-1',
      deliveryManId: '',
      status: 'delivered',
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotDeliveredOrder)
  })
})
