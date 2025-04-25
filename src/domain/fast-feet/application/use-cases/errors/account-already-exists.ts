import type { UseCaseError } from '@/core/errors/use-case-error'

export class AccountAlreadyExists extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Account ${identifier} already exists.`)
  }
}
