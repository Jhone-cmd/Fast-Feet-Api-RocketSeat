import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachment-repository'
import { FakerUploader } from 'test/storage/faker-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let fakerUploader: FakerUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    fakerUploader = new FakerUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakerUploader
    )
  })

  it('should be able to upload and create attachment', async () => {
    const result = await sut.execute({
      fileName: 'order.jpg',
      fileType: 'image/jpg',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    })

    expect(fakerUploader.uploads).toHaveLength(1)
    expect(fakerUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'order.jpg',
      })
    )
  })

  it('should not be able to upload an attachment with invalid type', async () => {
    const result = await sut.execute({
      fileName: 'audio.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
