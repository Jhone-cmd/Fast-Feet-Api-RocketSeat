import type { UseCaseError } from "src/core/errors/use-case-error";

export class InvalidCPF extends Error implements UseCaseError {
    constructor(identifier: string) {
        super(`Invalid ${identifier} format.`)
    }
}