import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          error: fromError(error),
        })
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
