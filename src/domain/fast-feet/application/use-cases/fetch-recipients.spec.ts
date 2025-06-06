import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeRecipient } from 'test/factories/make-recipient'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { FetchRecipientsUseCase } from './fetch-recipients'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: FetchRecipientsUseCase

describe('Fetch Recipients', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new FetchRecipientsUseCase(inMemoryRecipientRepository)
  })

  it('should be able to fetch recipient', async () => {
    await inMemoryRecipientRepository.create(
      makeRecipient(
        {
          createdAt: new Date(2025, 1, 12),
        },
        new UniqueEntityId('recipient-1')
      )
    )

    await inMemoryRecipientRepository.create(
      makeRecipient(
        {
          createdAt: new Date(2025, 1, 10),
        },
        new UniqueEntityId('recipient-2')
      )
    )

    await inMemoryRecipientRepository.create(
      makeRecipient(
        {
          createdAt: new Date(2025, 1, 15),
        },
        new UniqueEntityId('recipient-3')
      )
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.recipients).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 1, 15) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 12) }),
      expect.objectContaining({ createdAt: new Date(2025, 1, 10) }),
    ])
  })

  it('should be able to fetch paginated recipient', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientRepository.create(makeRecipient())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.recipients).toHaveLength(2)
  })
})
