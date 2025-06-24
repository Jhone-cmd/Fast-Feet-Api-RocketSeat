import { ApiProperty } from '@nestjs/swagger'

export class EditAccountProperties {
  @ApiProperty({
    description: 'Name of the account',
    example: 'john doe',
    minLength: 3,
    required: false,
  })
  name!: string

  @ApiProperty({
    description: 'Account email address (must be unique)',
    example: 'johndoe@example.com',
    format: 'email',
    required: false,
  })
  email!: string
}
