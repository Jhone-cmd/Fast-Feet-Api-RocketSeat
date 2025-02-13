import type { USeCaseError } from "src/core/errors/use-case-error";

export class WrongJOB extends Error implements USeCaseError {
    constructor(identifier: string) {
        super(`Job ${identifier} reported wrong.`)
    }
}