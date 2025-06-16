import type { UseCaseError } from '@/core/errors/use-case-error'

export class NotDeliveredOrder extends Error implements UseCaseError {
  constructor() {
    super('Unable to deliver the order, please add a photo.')
  }
}
