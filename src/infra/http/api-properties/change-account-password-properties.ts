import { ApiProperty } from '@nestjs/swagger'

export class ChangeAccountPasswordProperties {
  @ApiProperty({
    description: 'Account password (minimum 8 characters)',
    example: 'securePassword123',
    minLength: 8,
  })
  password!: string
}
