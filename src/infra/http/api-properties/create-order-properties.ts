import { ApiProperty } from '@nestjs/swagger'

export class CreateOrderProperties {
  @ApiProperty({
    description: 'Name of order',
    example: '',
    minLength: 3,
  })
  name!: string

  @ApiProperty({
    description: 'Status of the order',
    enum: ['waiting', 'withdrawal', 'returned', 'delivered'],
    default: 'waiting',
    example: 'waiting',
  })
  status!: 'waiting' | 'withdrawal' | 'returned' | 'delivered'

  @ApiProperty({
    description: 'Latitude of order',
    example: -15.8466048,
  })
  latitude!: number

  @ApiProperty({
    description: 'Longitude of order',
    example: -48.0247808,
  })
  longitude!: number
}
