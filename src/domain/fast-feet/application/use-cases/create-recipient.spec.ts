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
    const result = await sut.execute({
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
    await sut.execute({
      name: 'john doe',
      address: 'Rua Nova Cidade',
      phone: '61988776655',
      cpf: '12345678910',
    })

    const result = await sut.execute({
      name: 'john doe',
      address: 'Rua Nova Cidade',
      phone: '61988776655',
      cpf: '12345678910',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(RecipientAlreadyExists)
  })
})
