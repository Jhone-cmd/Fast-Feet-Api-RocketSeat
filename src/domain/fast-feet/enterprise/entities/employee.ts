import { Entity } from 'src/core/entities/entity'
import type { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import type { Optional } from 'src/core/types/optional'
import type { Role } from './types/role'
import type { CPF } from './value-objects/cpf'

export interface EmployeeProps {
  name: string
  email: string
  cpf: CPF
  password: string
  role: Role
  createdAt: Date
  updatedAt?: Date
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

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get role() {
    return this.props.role
  }

  set role(role: Role) {
    this.props.role = role
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

  static isValidRole(role: string): boolean {
    const responsibility: string[] = ['admin', 'deliveryman']
    return responsibility.includes(role)
  }
}
