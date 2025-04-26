import type { UseCaseError } from '@/core/errors/use-case-error'

export class RecipientAlreadyExists extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Recipient ${identifier} already exists.`)
  }
}
