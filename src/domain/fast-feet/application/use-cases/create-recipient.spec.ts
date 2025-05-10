import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { makeEmployee } from 'test/factories/make-employee'
import { InMemoryEmployeeRepository } from 'test/repositories/in-memory-employee-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { generateCPF } from 'test/utils/generate-cpf'
import { CreateRecipientUseCase } from './create-recipient'
import { RecipientAlreadyExists } from './errors/recipient-already-exists'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryEmployeeRepository: InMemoryEmployeeRepository
let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryEmployeeRepository = new InMemoryEmployeeRepository()
    sut = new CreateRecipientUseCase(
      inMemoryRecipientRepository,
      inMemoryEmployeeRepository
    )
  })

  it('should be able to create a recipient', async () => {
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
      name: 'john doe',
      address: 'Rua Nova Cidade',
      phone: '61988776655',
      cpf: generateCPF(),
    })

    expect(inMemoryRecipientRepository.items).toHaveLength(1)
    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    })
  })

  it('should not be able register a recipient with same cpf', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee(
        {
          rule: 'admin',
        },
        new UniqueEntityId('employee-1')
      )
    )

    await sut.execute({
      adminId: 'employee-1',
      name: 'john doe',
      address: 'Rua Nova Cidade',
      phone: '61988776655',
      cpf: '12345678910',
    })

    const result = await sut.execute({
      adminId: 'employee-1',
      name: 'john doe',
      address: 'Rua Nova Cidade',
      phone: '61988776655',
      cpf: '12345678910',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(RecipientAlreadyExists)
  })

  it('should not be able to create an order without admin permission', async () => {
    await inMemoryEmployeeRepository.create(
      makeEmployee({}, new UniqueEntityId('employee-1'))
    )

    const result = await sut.execute({
      adminId: 'employee-1',
      name: 'john doe',
      address: 'Rua Nova Cidade',
      phone: '61988776655',
      cpf: generateCPF(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
