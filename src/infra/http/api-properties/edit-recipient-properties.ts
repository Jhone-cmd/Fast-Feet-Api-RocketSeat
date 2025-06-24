import { ApiProperty } from '@nestjs/swagger'

export class EditRecipientProperties {
  @ApiProperty({
    description: 'Name of recipient',
    example: 'Antunes Ferreira',
    minLength: 3,
    required: false,
  })
  name!: string

  @ApiProperty({
    description: 'Phone of recipient',
    example: '66 97777-5555',
    minLength: 9,
    required: false,
  })
  phone!: string

  @ApiProperty({
    description: 'Address of recipient',
    example: 'Street Nothing',
    minLength: 3,
    required: false,
  })
  address!: string
}
