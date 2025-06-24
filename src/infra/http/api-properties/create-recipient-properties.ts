import { ApiProperty } from '@nestjs/swagger'

export class CreateRecipientProperties {
  @ApiProperty({
    description: 'Name of recipient',
    example: 'Antunes Ferreira',
    minLength: 3,
  })
  name!: string

  @ApiProperty({
    description: 'CPF of recipient (11 digits, unique)',
    example: '11122233344',
    pattern: '^[0-9]{11}$', // More explicit for Swagger UI
    minLength: 11,
    maxLength: 11,
  })
  cpf!: string

  @ApiProperty({
    description: 'Phone of recipient',
    example: '66 97777-5555',
    minLength: 9,
  })
  phone!: string

  @ApiProperty({
    description: 'Address of recipient',
    example: 'Street Nothing',
    minLength: 3,
  })
  address!: string
}
