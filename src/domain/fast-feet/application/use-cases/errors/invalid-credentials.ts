import type { UseCaseError } from "src/core/errors/use-case-error";

export class InvalidCredentials extends Error implements UseCaseError {
    constructor() {
        super('Invalid Credentials')
    }
}