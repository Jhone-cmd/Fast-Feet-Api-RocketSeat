import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowed } from '@/core/errors/error/not-allowed'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationRepository: InMemoryNotificationRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    inMemoryNotificationRepository.items.push(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date)
    )
  })

  it('should not be able to read a notification from another recipient', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    inMemoryNotificationRepository.items.push(notification)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowed)
  })
})
