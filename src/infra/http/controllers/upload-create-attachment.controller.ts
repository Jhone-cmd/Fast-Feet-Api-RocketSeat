import { InvalidAttachmentType } from '@/domain/fast-feet/application/use-cases/errors/invalid-attachment-type'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { NestUploadAndCreateAttachmentUseCase } from '../nest-use-cases/nest-upload-create-attachment-use-case'

@Controller('/attachments')
export class UploadCreateAttachmentController {
  constructor(
    private nestUploadAndCreateAttachment: NestUploadAndCreateAttachmentUseCase
  ) {}

  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), //2mb
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const result = await this.nestUploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidAttachmentType:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
