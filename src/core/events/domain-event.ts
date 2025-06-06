import type { UniqueEntityId } from '../entities/unique-entity-id'

export interface DomainEvent {
  occurredAt: Date
  getAggregatedId(): UniqueEntityId
}
