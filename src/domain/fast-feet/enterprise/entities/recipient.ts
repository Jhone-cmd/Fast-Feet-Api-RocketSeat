import { Entity } from "src/core/entities/entity";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";
import type { CPF } from "./value-objects/cpf";
interface RecipientProps {
    name: string
    address: string
	cpf: CPF
	password: string
	createdAt: Date
	updatedAt?: Date
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

	get password() {
		return this.props.password
	}

	set password(password: string) {
		this.props.password = password
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

    static create(props: RecipientProps, id?: UniqueEntityId) {
        const recipient = new Recipient(props, id)
        return recipient
    }
}