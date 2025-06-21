import { ApiProperty } from '@nestjs/swagger'

export class RegisterAccountProperties {
  @ApiProperty({
    description: 'Name of the account',
    example: 'john doe',
    minLength: 3,
  })
  name!: string

  @ApiProperty({
    description: 'Account email address (must be unique)',
    example: 'johndoe@example.com',
    format: 'email',
  })
  email!: string

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

  @ApiProperty({
    description: 'Role of the account',
    enum: ['admin', 'deliveryman'],
    default: 'deliveryman',
    example: 'deliveryman',
  })
  rule!: 'admin' | 'deliveryman'
}
