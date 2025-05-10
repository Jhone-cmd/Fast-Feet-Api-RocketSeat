import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'

import { NotAllowed } from '@/core/errors/error/not-allowed'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { EditRecipientUseCase } from './edit-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: EditRecipientUseCase

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    sut = new EditRecipientUseCase(
      inMemoryRecipientRepository,
      inMemoryEmployeeRepository
    )
  })

  it('should be able to edit a recipient', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'admin',
        },
        new UniqueEntityId('employee-1')
      )
    )

    await inMemoryRecipientRepository.create(
      makeRecipient(
        {
          name: 'john doe',
          address: 'Rua Nada - Cidade Nova',
          phone: '(99) 8877-5544',
        },
        new UniqueEntityId('recipient-1')
      )
    )

    const result = await sut.execute({
      adminId: 'employee-1',
      recipientId: 'recipient-1',
      name: 'John Doe 2',
      address: 'Rua Nova - Cidade Alegre',
      phone: '(88) 7766-2211',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryRecipientRepository.items[0]).toMatchObject({
      name: 'John Doe 2',
      address: 'Rua Nova - Cidade Alegre',
      phone: '(88) 7766-2211',
    })
  })

  it('should not be able to edit a recipient without admin permission', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee({}, new UniqueEntityId('employee-1'))
    )
    await inMemoryRecipientRepository.create(
      makeRecipient(
        {
          name: 'john doe',
          address: 'Rua Nada - Cidade Nova',
          phone: '(99) 8877-5544',
        },
        new UniqueEntityId('recipient-1')
      )
    )

    const result = await sut.execute({
      adminId: 'employee-1',
      recipientId: 'recipient-1',
      name: 'John Doe 2',
      address: 'Rua Nova - Cidade Alegre',
      phone: '(88) 7766-2211',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
