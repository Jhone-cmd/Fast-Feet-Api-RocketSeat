import { AggregateRoot } from '../entities/aggregate-root'
import type { UniqueEntityId } from '../entities/unique-entity-id'
import type { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

// Exemplo de evento do CustomAggregate
class CustomAggregateCreated implements DomainEvent {
  public occurredAt: Date
  private aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.occurredAt = new Date()
    this.aggregate = aggregate
  }
  getAggregatedId(): UniqueEntityId {
    throw new Error('Method not implemented.')
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

// Exemplo de criação de uma funcionalidade
class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callBackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callBackSpy, CustomAggregateCreated.name)

    // Estou criando uma resposta porém SEM salvar no bando de dados
    const aggregate = CustomAggregate.create()

    // Assegurando que o evento foi criado porém NÂO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callBackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
