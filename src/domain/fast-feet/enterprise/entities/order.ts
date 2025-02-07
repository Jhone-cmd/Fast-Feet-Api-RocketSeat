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
    latitude: number
    longitude: number
    createdAt: Date
    updatedAt?: Date
}


export class Order extends Entity<OrderProps> {
    get name() {
        return this.props.name
    }

    set name(name: string) {
        this.props.name = name
        this.touch()
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

    set status(status: OrderStatus) {
        this.props.status = status
        this.touch()
    }

    get slug() {
        return this.props.slug
    }

    get latitude() {
        return this.props.latitude
    }

    set latitude(latitude: number) {
        this.props.latitude = latitude
        this.touch()
    }

    get longitude() {
        return this.props.longitude
    }

    set longitude(longitude: number) {
        this.props.longitude = longitude
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

    static create(props: OrderProps, id?: UniqueEntityId) {
            const order = new Order(props, id)
            return order
        }


}