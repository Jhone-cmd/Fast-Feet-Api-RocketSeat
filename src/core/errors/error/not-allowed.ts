import type { USeCaseError } from "../use-case-error";

export class NOtAllowed extends Error implements USeCaseError {
    constructor() {
        super('Not Allowed.')
    }
}