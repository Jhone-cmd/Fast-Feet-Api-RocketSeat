import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateProperties {
  @ApiProperty({
    description: 'Account CPF (11 digits, unique)',
    example: '11122233344',
    pattern: '^[0-9]{11}$', // More explicit for Swagger UI
    minLength: 11,
    maxLength: 11,
  })
  cpf!: string

  @ApiProperty({
    description: 'Account password (minimum 8 characters)',
    example: 'securePassword123',
    minLength: 8,
  })
  password!: string
}
