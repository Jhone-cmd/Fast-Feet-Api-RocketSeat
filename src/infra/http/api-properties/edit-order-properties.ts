import { ApiProperty } from '@nestjs/swagger'

export class EditOrderProperties {
  @ApiProperty({
    description: 'Name of order',
    example: 'Order Box',
    minLength: 3,
    required: false,
  })
  name!: string

  @ApiProperty({
    description: 'deliveryManId of order',
    example: '7fe70572-72f9-4503-88fa-0d1bde1e22aa',
    type: 'string',
    required: false,
  })
  deliveryManId!: string
}
