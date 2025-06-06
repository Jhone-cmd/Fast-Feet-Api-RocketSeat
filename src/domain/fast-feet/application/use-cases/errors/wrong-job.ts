import type { UseCaseError } from '@/core/errors/use-case-error'

export class WrongJOB extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Job ${identifier} reported wrong.`)
  }
}
