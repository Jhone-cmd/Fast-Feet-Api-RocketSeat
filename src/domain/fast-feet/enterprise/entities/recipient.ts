import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import type { CPF } from './value-objects/cpf'
export interface RecipientProps {
  name: string
  address: string
  phone: string
  cpf: CPF
  createdAt: Date
  updatedAt?: Date | null
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get address() {
    return this.props.address
  }

  set address(address: string) {
    this.props.address = address
    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(cpf: CPF) {
    this.props.cpf = cpf
    this.touch()
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
    return recipient
  }
}
