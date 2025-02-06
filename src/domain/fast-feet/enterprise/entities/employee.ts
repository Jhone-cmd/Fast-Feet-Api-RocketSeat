import { Entity } from "src/core/entities/entity";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";
import type { Role } from "./types/role";
import type { CPF } from "./value-objects/cpf";

interface EmployeeProps {
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

	get email() {
		return this.props.email
	}

	get cpf() {
		return this.props.cpf
	}

	get password() {
		return this.props.password
	}

	get role() {
		return this.props.role
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	static create(props: EmployeeProps, id?: UniqueEntityId) {
		const employee = new Employee(props, id)
		return employee
	}
}
