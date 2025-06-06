import type { UseCaseError } from '../use-case-error'

export class ResourceNotFound extends Error implements UseCaseError {
  constructor() {
    super('Resource Not Found.')
  }
}
