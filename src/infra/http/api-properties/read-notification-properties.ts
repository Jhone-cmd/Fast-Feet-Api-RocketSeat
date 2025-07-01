import { ApiProperty } from '@nestjs/swagger'

export class ReadNotificationProperties {
  @ApiProperty({
    name: 'recipientId',
    description: 'recipientId for read notification.',
    example: '080d96e7-96d8-4127-a2b9-877e0402c96b',
  })
  recipientId!: string
}
