import type { USeCaseError } from "../use-case-error";

export class ResourceNotFound extends Error implements USeCaseError {
    constructor() {
        super('Resource Not Found.')
    }
}