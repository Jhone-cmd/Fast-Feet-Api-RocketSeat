import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import { OrderChangeStatusEvent } from '../events/order-change-status-event'
import type { OrderStatus } from './types/order-status'
import { Slug } from './value-objects/slug'

export interface OrderProps {
  name: string
  // employeeId: UniqueEntityId
  deliverymanId: UniqueEntityId | null
  recipientId: UniqueEntityId
  status: OrderStatus
  slug: Slug
  latitude: number
  longitude: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  // get employeeId() {
  //   return this.props.employeeId
  // }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  set deliverymanId(deliverymanId: UniqueEntityId | null) {
    this.props.deliverymanId = deliverymanId
    this.touch()
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

    this.addDomainEvent(new OrderChangeStatusEvent(this, status))
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

  static create(
    props: Optional<OrderProps, 'createdAt' | 'slug' | 'deliverymanId'>,
    id?: UniqueEntityId
  ) {
    const order = new Order(
      {
        ...props,
        deliverymanId: props.deliverymanId ?? null,
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
    return order
  }
}
