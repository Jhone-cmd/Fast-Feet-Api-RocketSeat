import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/error/resource-not-found'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { CreateOrderUseCase } from './create-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryRecipientRepository
    )
  })

  it('should be able to create an order', async () => {
    const recipient = makeRecipient({}, new UniqueEntityId('recipient-1'))

    inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
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
    const result = await sut.execute({
      name: 'Carga de auto valor',
      status: 'waiting',
      recipientId: '',
      latitude: 0,
      longitude: 0,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
