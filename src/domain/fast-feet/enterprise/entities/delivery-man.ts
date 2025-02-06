import { Entity } from "src/core/entities/entity";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";
import type { CPF } from "./value-objects/cpf";

interface DeliveryManProps {
	name: string
	cpf: CPF
	password: string
	latitude: string
	longitude: string
	createdAt: Date
	updatedAt?: Date
}

export class DeliveryMan extends Entity<DeliveryManProps> {
	get name() {
		return this.props.name
	}

	get password() {
		return this.props.password
	}

	get latitude() {
		return this.props.latitude
	}

	get longitude() {
		return this.props.longitude
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

	static create(props: DeliveryManProps, id?: UniqueEntityId) {
		const deliveryMan = new DeliveryMan(props, id)
		return deliveryMan
	}
}
