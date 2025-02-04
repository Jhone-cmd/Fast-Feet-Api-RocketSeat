import { Entity } from "src/core/entities/entity";
import type { UniqueEntityId } from "src/core/entities/unique-entity-id";

interface AdminProps {
    name: string;
}

export class Admin extends Entity<AdminProps> {
    get name() {
        return this.props.name;
    }

    static create(props: AdminProps, id?: UniqueEntityId) {
        const admin = new Admin(props, id);
        return admin;
    }
}