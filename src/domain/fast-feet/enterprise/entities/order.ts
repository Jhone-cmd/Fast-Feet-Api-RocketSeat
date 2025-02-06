import { Entity } from "src/core/entities/entity";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";
import type { OrderStatus } from "./types/order-status";
import type { Slug } from "./value-objects/slug";

export interface OrderProps {
    name: string
    employeeId: UniqueEntityId
    deliverymanId: UniqueEntityId
    recipientId: UniqueEntityId
    status: OrderStatus
    slug: Slug
    latitude: string
    longitude: string
    createdAt: Date
    updatedAt?: Date
}


export class Order extends Entity<OrderProps> {
    get name() {
        return this.props.name
    }

    get employeeId() {
        return this.props.employeeId
    }

    get deliverymanId() {
        return this.props.deliverymanId
    }

    get recipientId() {
        return this.props.recipientId
    }

    get status() {
        return this.props.status
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

    static create(props: OrderProps, id?: UniqueEntityId) {
            const order = new Order(props, id)
            return order
        }


}