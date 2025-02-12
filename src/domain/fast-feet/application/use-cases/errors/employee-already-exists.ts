import type { USeCaseError } from "src/core/errors/use-case-error";

export class EmployeeAlreadyExists extends Error implements USeCaseError {
	constructor(identifier: string) {
		super(`Employee ${identifier} already exists.`)
	}
}
