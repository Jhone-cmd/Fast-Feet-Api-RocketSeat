import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import type { Rule } from './types/rule'
import { CPF } from './value-objects/cpf'

export interface EmployeeProps {
  name: string
  email: string
  cpf: CPF
  password: string
  rule: Rule
  createdAt: Date
  updatedAt?: Date | null
}

export class Employee extends Entity<EmployeeProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(cpf: CPF) {
    this.props.cpf = cpf
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get rule() {
    return this.props.rule
  }

  set rule(rule: Rule) {
    this.props.rule = rule
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
    props: Optional<EmployeeProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const employee = new Employee(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
    return employee
  }
}
