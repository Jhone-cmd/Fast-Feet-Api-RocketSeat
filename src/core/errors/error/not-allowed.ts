import type { UseCaseError } from "../use-case-error";

export class NotAllowed extends Error implements UseCaseError {
    constructor() {
        super('Not Allowed.')
    }
}