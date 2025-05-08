import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { makeEmployee } from 'test/factories/make-employee'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { DeleteRecipientUseCase } from './delete-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: DeleteRecipientUseCase

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    sut = new DeleteRecipientUseCase(
      inMemoryRecipientRepository,
      inMemoryEmployeeRepository
    )
  })

  it('should be able to delete a recipient', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'admin',
        },
        new UniqueEntityId('employee-1')
      )
    )

    await inMemoryRecipientRepository.create(
      makeRecipient({}, new UniqueEntityId('recipient-1'))
    )

    await inMemoryRecipientRepository.create(
      makeRecipient({}, new UniqueEntityId('recipient-2'))
    )
    await sut.execute({
      adminId: 'employee-1',
      recipientId: 'recipient-1',
    })

    expect(inMemoryRecipientRepository.items).toHaveLength(1)
  })

  it('should not be able to delete a recipient without admin permission', async () => {
    await inMemoryRecipientRepository.create(
      makeRecipient({}, new UniqueEntityId('recipient-1'))
    )

    await inMemoryRecipientRepository.create(
      makeRecipient({}, new UniqueEntityId('recipient-2'))
    )

    const result = await sut.execute({
      adminId: 'employee-2',
      recipientId: 'recipient-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
