import { Entity } from "src/core/entities/entity";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";


interface DeliveryManProps {
	name: string;
}

export class DeliveryMan extends Entity<DeliveryManProps> {
	get name() {
		return this.props.name;
	}

	static create(props: DeliveryManProps, id?: UniqueEntityId) {
		const deliveryMan = new DeliveryMan(props, id);
		return deliveryMan;
	}
}
