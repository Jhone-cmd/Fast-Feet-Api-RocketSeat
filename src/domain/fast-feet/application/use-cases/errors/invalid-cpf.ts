import type { USeCaseError } from "src/core/errors/use-case-error";

export class InvalidCPF extends Error implements USeCaseError {
    constructor(identifier: string) {
        super(`Invalid ${identifier} format.`)
    }
}