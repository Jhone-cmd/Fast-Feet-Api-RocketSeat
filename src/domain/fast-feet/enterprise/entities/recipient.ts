import { Entity } from "src/core/entities/entity";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";


interface RecipientProps {
    name: string;
}

export class Recipient extends Entity<RecipientProps> {
    get name() {
        return this.props.name;
    }

    static create(props: RecipientProps, id?: UniqueEntityId) {
        const recipient = new Recipient(props, id);
        return recipient;
    }
}