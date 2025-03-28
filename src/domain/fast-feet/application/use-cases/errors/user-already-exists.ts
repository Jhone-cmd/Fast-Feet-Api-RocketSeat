import type { UseCaseError } from 'src/core/errors/use-case-error'

export class UserAlreadyExists extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`User ${identifier} already exists.`)
  }
}
