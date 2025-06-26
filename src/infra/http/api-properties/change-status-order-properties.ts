import { ApiProperty } from '@nestjs/swagger'

export class ChangeStatusOrderProperties {
  @ApiProperty({
    description: 'Status of the order',
    enum: ['waiting', 'withdrawal', 'returned', 'delivered'],
    default: 'waiting',
    example: 'waiting',
  })
  status!: 'waiting' | 'withdrawal' | 'returned' | 'delivered'
}
