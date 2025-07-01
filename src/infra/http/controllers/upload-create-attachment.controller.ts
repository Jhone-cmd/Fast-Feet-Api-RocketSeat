import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger'
import { InvalidAttachmentType } from '@/domain/fast-feet/application/use-cases/errors/invalid-attachment-type'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UploadCreateAttachmentProperties } from '../api-properties/upload-create-attachment-properties'
import { NestUploadAndCreateAttachmentUseCase } from '../nest-use-cases/nest-upload-create-attachment-use-case'
@ApiTags('Attachments')
@ApiBearerAuth()
@Controller('/attachments')
export class UploadCreateAttachmentController {
  constructor(
    private nestUploadAndCreateAttachment: NestUploadAndCreateAttachmentUseCase
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  @ApiCreatedResponse({
    description: 'Attachment Upload Successful.',
    example: {
      attachmentId: '3413f593-bf25-4b77-b6d3-48aa5d7a077b',
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo of the order.',
    type: UploadCreateAttachmentProperties,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid attachment type.' })
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

    const { attachment } = result.value

    return { attachmentId: attachment.id.toString() }
  }
}
